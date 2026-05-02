// Sovereign Ledger — Data Export Utility (CSV & PDF)
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import dayjs from 'dayjs';
import { formatCurrency } from './currency';

/**
 * Exports transaction data as a CSV file
 */
export const exportToCSV = async (transactions, currency) => {
  if (!transactions || transactions.length === 0) {
    throw new Error('No transactions to export');
  }

  const header = 'Date,Type,Category,Description,Amount,Currency\n';
  const rows = transactions.map(t => {
    return `${dayjs(t.date).format('YYYY-MM-DD HH:mm')},${t.type},${t.category},"${t.description || ''}",${t.amount},${currency.code}`;
  }).join('\n');

  const csvContent = header + rows;
  
  if (Platform.OS === 'web') {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sovereign_Ledger_Export_${dayjs().format('YYYYMMDD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  const fileName = `Sovereign_Ledger_Export_${dayjs().format('YYYYMMDD')}.csv`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(filePath, csvContent);
  await Sharing.shareAsync(filePath);
};

/**
 * Exports transaction data as a PDF report
 */
export const exportToPDF = async (transactions, currency) => {
  if (!transactions || transactions.length === 0) {
    throw new Error('No transactions to export');
  }

  const sortedTransactions = [...transactions].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  
  const rowsHtml = sortedTransactions.map(t => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${dayjs(t.date).format('MMM DD, YYYY')}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.category}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.description || '-'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; color: ${t.type === 'expense' ? '#FF3B30' : '#00C48C'}">
        ${t.type === 'expense' ? '-' : '+'}${formatCurrency(t.amount, currency)}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #0047BB; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #0047BB; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #666; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; background-color: #f8f9fb; padding: 12px 8px; font-size: 12px; text-transform: uppercase; color: #999; }
          .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #aaa; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Sovereign Ledger Report</div>
          <div class="subtitle">Exported on ${dayjs().format('MMMM DD, YYYY at HH:mm')}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <div class="footer">
          Generated locally by Sovereign Ledger — Your Private Expense Tracker
        </div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html: htmlContent });
  await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
};
