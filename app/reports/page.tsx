import { AlertTriangle, Calendar, CheckCircle, Download, Eye, FileText, Printer, Search, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScanReport {
  id: number;
  url: string;
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    element?: string;
    line?: number;
  }>;
  score: number;
  status: 'passed' | 'failed' | 'warning';
  createdAt: string;
}

const AccessibilityReports = () => {
  const [reports, setReports] = useState<ScanReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ScanReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'issues'>('date');

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data: ScanReport[] = await response.json();
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      const matchesSearch = report.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'score':
          return b.score - a.score;
        case 'issues':
          return b.issues.length - a.issues.length;
        default:
          return 0;
      }
    });

  // Export functions
  const convertToCSV = (data: ScanReport[]) => {
    const headers = ['ID', 'URL', 'Score', 'Status', 'Issues Count', 'Date'].join(',');
    const rows = data.map(report => [
      report.id,
      `"${report.url}"`,
      report.score,
      report.status,
      report.issues.length,
      `"${new Date(report.createdAt).toISOString()}"`
    ].join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(filteredReports);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `accessibility-reports-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      // Simple PDF generation using window.print with CSS media queries
      const printWindow = window.open('', '_blank');
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Accessibility Reports</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; }
            .report-header { text-align: center; margin-bottom: 30px; }
            .report-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .report-date { color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .status-passed { color: #059669; }
            .status-failed { color: #DC2626; }
            .status-warning { color: #D97706; }
            .score-high { color: #059669; font-weight: bold; }
            .score-medium { color: #D97706; font-weight: bold; }
            .score-low { color: #DC2626; font-weight: bold; }
            @media print {
              body { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <div class="report-title">Accessibility Reports</div>
            <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Score</th>
                <th>Status</th>
                <th>Issues</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredReports.map(report => `
                <tr>
                  <td>${report.url}</td>
                  <td class="${report.score >= 80 ? 'score-high' : report.score >= 60 ? 'score-medium' : 'score-low'}">${report.score}</td>
                  <td class="status-${report.status}">${report.status.toUpperCase()}</td>
                  <td>${report.issues.length}</td>
                  <td>${new Date(report.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      
      printWindow?.document.write(reportHTML);
      printWindow?.document.close();
      printWindow?.print();
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Please try again.');
    }
  };

  const printPage = () => {
    window.print();
  };

  const copyShareLink = (id: number) => {
    const link = `${window.location.origin}/reports/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link to clipboard');
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400 bg-green-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-96 bg-gray-700 rounded mb-8"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">📊 Accessibility Reports</h1>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Reports</h2>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .bg-gray-900 { background: white !important; }
          .text-white { color: black !important; }
          .bg-gray-800 { background: #f5f5f5 !important; }
          .border-gray-600 { border-color: #ddd !important; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📊 Accessibility Reports</h1>
          <p className="text-gray-400">View, export, and share your accessibility scan reports</p>
        </div>

        {/* Export Menu */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 mb-6 no-print">
          <h2 className="text-lg font-semibold mb-4">Export Options</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={printPage}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 mb-6 no-print">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="passed">Passed</option>
                <option value="warning">Warning</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'issues')}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="issues">Sort by Issues</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-400">{reports.length}</div>
            <div className="text-sm text-gray-400">Total Reports</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400">
              {reports.filter(r => r.status === 'passed').length}
            </div>
            <div className="text-sm text-gray-400">Passed</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400">
              {reports.filter(r => r.status === 'warning').length}
            </div>
            <div className="text-sm text-gray-400">Warnings</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="text-2xl font-bold text-red-400">
              {reports.filter(r => r.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
        </div>

        {/* Print Header (only visible when printing) */}
        <div className="print-only text-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold">Accessibility Reports</h1>
          <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Reports Table */}
        <div id="report-content" className="bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden">
          {filteredReports.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Reports Found</h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start scanning websites to generate reports.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Issues
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider no-print">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white truncate max-w-xs" title={report.url}>
                          {report.url}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-bold ${getScoreColor(report.score)}`}>
                          {report.score}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {report.issues.length > 0 ? (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                          <span className="text-gray-300">{report.issues.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="w-4 h-4" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 no-print">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyShareLink(report.id)}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Copy Share Link"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Report Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 no-print">
            <div className="bg-gray-800 border border-gray-600 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Report Details</h3>
                    <p className="text-gray-300 truncate">{selectedReport.url}</p>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(selectedReport.score)}`}>
                      {selectedReport.score}
                    </div>
                    <div className="text-sm text-gray-400">Accessibility Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">
                      {selectedReport.issues.length}
                    </div>
                    <div className="text-sm text-gray-400">Total Issues</div>
                  </div>
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status.toUpperCase()}
                    </span>
                    <div className="text-sm text-gray-400 mt-1">Status</div>
                  </div>
                </div>

                {selectedReport.issues.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Issues Found</h4>
                    <div className="space-y-3">
                      {selectedReport.issues.map((issue, index) => (
                        <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              issue.severity === 'critical' ? 'bg-red-500' :
                              issue.severity === 'high' ? 'bg-orange-500' :
                              issue.severity === 'medium' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <div className="font-medium text-white mb-1">{issue.type}</div>
                              <div className="text-gray-300 text-sm mb-2">{issue.message}</div>
                              {issue.element && (
                                <div className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded">
                                  {issue.element}
                                </div>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              issue.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                              issue.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                              issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityReports;