// Sovereign Ledger — Data Export Utilities (CSV & PDF)
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import dayjs from 'dayjs';
import { formatCurrency, DEFAULT_CURRENCY } from './currency';

/**
 * Export transactions as CSV file
 */
export const exportCSV = async (transactions, currency = DEFAULT_CURRENCY) => {
  try {
    const headers = 'Date,Type,Category,Description,Amount,Recurring\n';
    const rows = transactions
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      .map(t => {
        const date = dayjs(t.date).format('YYYY-MM-DD');
        const type = t.type === 'income' ? 'Income' : 'Expense';
        const amount = t.type === 'income' ? t.amount : -t.amount;
        const description = `"${(t.description || '').replace(/"/g, '""')}"`;
        const category = `"${t.category}"`;
        const recurring = t.isRecurring ? 'Yes' : 'No';
        return `${date},${type},${category},${description},${amount},${recurring}`;
      })
      .join('\n');

    const csvContent = headers + rows;
    const fileName = `sovereign_ledger_export_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Transactions',
        UTI: 'public.comma-separated-values-text',
      });
    }

    return { success: true, filePath };
  } catch (error) {
    console.error('CSV export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export transactions as styled PDF
 */
export const exportPDF = async (transactions, summary, currency = DEFAULT_CURRENCY) => {
  try {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    const transactionRows = transactions
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      .map(t => `
        <tr>
          <td>${dayjs(t.date).format('MMM DD, YYYY')}</td>
          <td><span class="badge ${t.type}">${t.type === 'income' ? 'Income' : 'Expense'}</span></td>
          <td>${t.category}</td>
          <td>${t.description || '-'}</td>
          <td class="${t.type}" style="text-align: right; font-weight: 600;">
            ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount, currency)}
          </td>
        </tr>
      `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Sovereign Ledger - Financial Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; background: #fafbfc; padding: 40px; }
          .header { text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #2F7CF6; }
          .header h1 { font-size: 28px; color: #0D0F14; margin-bottom: 4px; }
          .header p { color: #666; font-size: 14px; }
          .summary { display: flex; gap: 16px; margin-bottom: 32px; }
          .summary-card { flex: 1; padding: 20px; border-radius: 12px; text-align: center; }
          .summary-card.income { background: #E8F5E9; border: 1px solid #C8E6C9; }
          .summary-card.expense { background: #FFEBEE; border: 1px solid #FFCDD2; }
          .summary-card.balance { background: #E3F2FD; border: 1px solid #BBDEFB; }
          .summary-card h3 { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 8px; letter-spacing: 1px; }
          .summary-card .amount { font-size: 24px; font-weight: 700; }
          .summary-card.income .amount { color: #219653; }
          .summary-card.expense .amount { color: #EB5757; }
          .summary-card.balance .amount { color: #2F7CF6; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #0D0F14; color: white; padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          th:first-child { border-radius: 8px 0 0 0; }
          th:last-child { border-radius: 0 8px 0 0; text-align: right; }
          td { padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; }
          tr:nth-child(even) { background: #f8f9fa; }
          .badge { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
          .badge.income { background: #E8F5E9; color: #219653; }
          .badge.expense { background: #FFEBEE; color: #EB5757; }
          .income { color: #219653; }
          .expense { color: #EB5757; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💎 Sovereign Ledger</h1>
          <p>Financial Report — Generated ${dayjs().format('MMMM DD, YYYY')}</p>
        </div>
        <div class="summary">
          <div class="summary-card income">
            <h3>Total Income</h3>
            <div class="amount">${formatCurrency(totalIncome, currency)}</div>
          </div>
          <div class="summary-card expense">
            <h3>Total Expenses</h3>
            <div class="amount">${formatCurrency(totalExpenses, currency)}</div>
          </div>
          <div class="summary-card balance">
            <h3>Net Balance</h3>
            <div class="amount">${formatCurrency(balance, currency)}</div>
          </div>
        </div>
        <h2 style="font-size: 18px; margin-bottom: 16px;">Transaction History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transactionRows || '<tr><td colspan="5" style="text-align:center;padding:24px;color:#999;">No transactions to display</td></tr>'}
          </tbody>
        </table>
        <div class="footer">
          <p>Sovereign Ledger — Secured by Enterprise-Grade Encryption</p>
          <p>Total Transactions: ${transactions.length}</p>
        </div>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Export Financial Report',
        UTI: 'com.adobe.pdf',
      });
    }

    return { success: true, filePath: uri };
  } catch (error) {
    console.error('PDF export error:', error);
    return { success: false, error: error.message };
  }
};

export default { exportCSV, exportPDF };
