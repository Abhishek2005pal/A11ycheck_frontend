import { AlertTriangle, BarChart3, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TrendData {
  date: string;
  avgScore: string;
  totalIssues: number;
}

interface StatsData {
  mostImproved: { date: string; improvement: number; from: number; to: number } | null;
  worstIssueDay: { date: string; issues: number } | null;
  totalScans: number;
  dateRange: { start: string; end: string } | null;
}

const AccessibilityTrends = () => {
  const [data, setData] = useState<TrendData[]>([]);
  const [filteredData, setFilteredData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('30'); // days
  const [stats, setStats] = useState<StatsData>({
    mostImproved: null,
    worstIssueDay: null,
    totalScans: 0,
    dateRange: null
  });

  // Fetch data from API
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/trends');
        if (!response.ok) {
          throw new Error('Failed to fetch trends data');
        }
        const trendsData: TrendData[] = await response.json();
        setData(trendsData);
        setFilteredData(trendsData);
        calculateStats(trendsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  // Filter data based on selected date range
  useEffect(() => {
    if (data.length === 0) return;

    const days = parseInt(dateFilter);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filtered = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });

    setFilteredData(filtered);
    calculateStats(filtered);
  }, [dateFilter, data]);

  const calculateStats = (trendsData: TrendData[]) => {
    if (trendsData.length === 0) {
      setStats({
        mostImproved: null,
        worstIssueDay: null,
        totalScans: 0,
        dateRange: null
      });
      return;
    }

    // Calculate most improved day
    let mostImproved = null;
    let maxImprovement = 0;

    for (let i = 1; i < trendsData.length; i++) {
      const currentScore = parseFloat(trendsData[i].avgScore);
      const previousScore = parseFloat(trendsData[i - 1].avgScore);
      const improvement = currentScore - previousScore;

      if (improvement > maxImprovement) {
        maxImprovement = improvement;
        mostImproved = {
          date: trendsData[i].date,
          improvement,
          from: previousScore,
          to: currentScore
        };
      }
    }

    // Find worst issue day
    const worstIssueDay = trendsData.reduce((worst, current) => {
      return current.totalIssues > worst.totalIssues ? current : worst;
    });

    // Calculate date range
    const sortedDates = trendsData.map(d => d.date).sort();
    const dateRange = {
      start: sortedDates[0],
      end: sortedDates[sortedDates.length - 1]
    };

    setStats({
      mostImproved,
      worstIssueDay: { date: worstIssueDay.date, issues: worstIssueDay.totalIssues },
      totalScans: trendsData.length,
      dateRange
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 font-medium">{`Date: ${formatDate(label)}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey === 'avgScore' ? 'Average Score' : 'Total Issues'}: ${entry.value}${entry.dataKey === 'avgScore' ? '' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-96 bg-gray-700 rounded mb-8"></div>
            <div className="h-32 bg-gray-700 rounded mb-6"></div>
            <div className="h-96 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">📈 Accessibility Trends</h1>
          <p className="text-gray-400 mb-8">Track performance and issue patterns over time</p>
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Data</h2>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">📈 Accessibility Trends</h1>
          <p className="text-gray-400 mb-8">Track performance and issue patterns over time</p>
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">No Trends Available</h2>
            <p className="text-gray-400 text-lg">Start scanning to track progress!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📈 Accessibility Trends</h1>
          <p className="text-gray-400">Track performance and issue patterns over time</p>
        </div>

        {/* Date Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Date Range:</span>
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Most Improved</span>
            </div>
            {stats.mostImproved ? (
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {stats.mostImproved.from.toFixed(1)} → {stats.mostImproved.to.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">
                  {formatDate(stats.mostImproved.date)}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No data</div>
            )}
          </div>

          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-gray-400">Most Issues</span>
            </div>
            {stats.worstIssueDay ? (
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {stats.worstIssueDay.issues}
                </div>
                <div className="text-sm text-gray-400">
                  {formatDate(stats.worstIssueDay.date)}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No data</div>
            )}
          </div>

          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Total Scans</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {stats.totalScans}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Date Range</span>
            </div>
            {stats.dateRange ? (
              <div>
                <div className="text-sm font-medium text-purple-400">
                  {formatDate(stats.dateRange.start)}
                </div>
                <div className="text-xs text-gray-400">to</div>
                <div className="text-sm font-medium text-purple-400">
                  {formatDate(stats.dateRange.end)}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No data</div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">📊 Performance Trends</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={formatDate}
                />
                <YAxis 
                  yAxisId="score"
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <YAxis 
                  yAxisId="issues"
                  orientation="right"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  yAxisId="score"
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Average Score"
                />
                <Line 
                  yAxisId="issues"
                  type="monotone" 
                  dataKey="totalIssues" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  name="Total Issues"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="mt-4 flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className="text-gray-400">Average Score (Left Axis)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span className="text-gray-400">Total Issues (Right Axis)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityTrends;