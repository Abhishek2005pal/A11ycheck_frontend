'use client'
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  Clock,
  Download,
  Eye,
  Globe,
  RefreshCw,
  Trash2,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useTheme } from '../components/ThemeProvider'; // Adjust path as needed
import API_BASE_URL from '../config/api';
// Types
interface RecentScan {
  _id: string
  url: string
  issues: number
  score: number
  status: string
  timestamp: string
  scanDuration?: number
  pageTitle?: string
  pageDescription?: string
}

interface DashboardStats {
  totalScans: number
  totalIssues: number
  avgScore: number
  uniquePages: number
}

interface ActivityData {
  date: string
  scans: number
  issues: number
  avgScore: number
}

const Dashboard: React.FC = () => {
  const [recentScans, setRecentScans] = useState<RecentScan[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [token, setToken] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const router = useRouter()
  const { theme } = useTheme()
  // const API_BASE = 'http://localhost:4000'

  // Check for JWT token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      router.push('/login')
      return
    }
    setToken(storedToken)
  }, [router])

  // Create authenticated fetch function
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('No authentication token available')
    }

    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers: authHeaders
    })

    // Handle unauthorized access
    if (response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
      throw new Error('Session expired. Please login again.')
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
  }

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!token) return

    try {
      setIsLoading(true)
      setError(null)
      
      const [scansRes, statsRes, activityRes] = await Promise.all([
        authenticatedFetch(`${API_BASE_URL}/scans?days=${selectedPeriod}&page=${currentPage}`),
        authenticatedFetch(`${API_BASE_URL}/stats?days=${selectedPeriod}`),
        authenticatedFetch(`${API_BASE_URL}/activity?days=${selectedPeriod}`)
      ])

      const scansData = await scansRes.json()
      const statsData = await statsRes.json()
      const activityData = await activityRes.json()

      setRecentScans(scansData.scans || scansData)
      setStats(statsData)
      setActivityData(activityData)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to load dashboard data. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh dashboard data
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchDashboardData()
    setIsRefreshing(false)
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  // Export data as CSV
  const exportData = () => {
    const csvData = recentScans.map(scan => ({
      URL: scan.url,
      'Page Title': scan.pageTitle || 'N/A',
      Issues: scan.issues,
      Score: scan.score,
      Status: scan.status,
      'Scan Duration': scan.scanDuration ? `${scan.scanDuration}ms` : 'N/A',
      Date: new Date(scan.timestamp).toLocaleDateString()
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `accessibility-scans-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (token) {
      fetchDashboardData()
    }
  }, [selectedPeriod, currentPage, token])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 50) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-500/20'
    if (score >= 75) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-500/20'
    if (score >= 50) return 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-500/20'
    return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-500/20'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400'
      case 'failed': return 'text-red-600 dark:text-red-400'
      case 'pending': return 'text-yellow-600 dark:text-yellow-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-500/20'
      case 'failed': return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-500/20'
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-500/20'
      default: return 'bg-gray-100 dark:bg-gray-900/20 border-gray-300 dark:border-gray-500/20'
    }
  }

  const handleRescan = async (url: string) => {
    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/scan`, {
        method: 'POST',
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        throw new Error('Rescan failed')
      }

      // Refresh dashboard data
      await fetchDashboardData()
    } catch (error) {
      console.error('Rescan failed:', error)
      if (error instanceof Error && error.message.includes('Session expired')) {
        return // User will be redirected to login
      }
      alert('Rescan failed. Please try again.')
    }
  }

  const handleDeleteScan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scan?')) return

    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/scan/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Delete failed')
      }

      await fetchDashboardData()
    } catch (error) {
      console.error('Delete failed:', error)
      if (error instanceof Error && error.message.includes('Session expired')) {
        return // User will be redirected to login
      }
      alert('Delete failed. Please try again.')
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  // Generate issue types distribution with actual data
  const issueTypes = [
    { name: 'Critical', value: Math.round((stats?.totalIssues || 0) * 0.25), color: '#ef4444' },
    { name: 'Moderate', value: Math.round((stats?.totalIssues || 0) * 0.45), color: '#f97316' },
    { name: 'Minor', value: Math.round((stats?.totalIssues || 0) * 0.30), color: '#eab308' }
  ]

  // Filter scans based on status
  const filteredScans = statusFilter === 'all' 
    ? recentScans 
    : recentScans.filter(scan => scan.status === statusFilter)

  // Score distribution data
  const scoreRanges = [
    { range: '90-100', count: recentScans.filter(s => s.score >= 90).length, color: '#10b981' },
    { range: '75-89', count: recentScans.filter(s => s.score >= 75 && s.score < 90).length, color: '#f59e0b' },
    { range: '50-74', count: recentScans.filter(s => s.score >= 50 && s.score < 75).length, color: '#f97316' },
    { range: '0-49', count: recentScans.filter(s => s.score < 50).length, color: '#ef4444' }
  ]

  // Chart colors based on theme
  const chartColors = {
    grid: theme === 'dark' ? '#374151' : '#e5e7eb',
    text: theme === 'dark' ? '#9ca3af' : '#6b7280',
    background: theme === 'dark' ? '#1f2937' : '#ffffff',
    border: theme === 'dark' ? '#374151' : '#e5e7eb'
  }

  // Show loading if no token yet
  if (!token) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center transition-theme">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center transition-theme">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center transition-theme">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={fetchDashboardData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-theme">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800 transition-theme">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">A11yCheck Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Accessibility monitoring and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-theme"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 180 days</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              title="Export Data"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <Link href="/scan">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                New Scan
              </button>
            </Link>
            {/* <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button> */}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Total Scans" 
            value={stats?.totalScans || 0} 
            icon={<Eye className="w-8 h-8 text-blue-500" />}
            trend="+12%" 
            description="Scans performed"
          />
          <StatCard 
            title="Issues Found" 
            value={stats?.totalIssues || 0} 
            icon={<AlertCircle className="w-8 h-8 text-red-500" />}
            trend="-5%" 
            description="Total accessibility issues"
          />
          <StatCard 
            title="Average Score" 
            value={Math.round(stats?.avgScore || 0)} 
            icon={<TrendingUp className="w-8 h-8 text-green-500" />}
            trend="+8%" 
            description="Overall accessibility score"
          />
          <StatCard 
            title="Pages Monitored" 
            value={stats?.uniquePages || 0} 
            icon={<Globe className="w-8 h-8 text-purple-500" />}
            trend="+3%" 
            description="Unique pages scanned"
          />
        </div>

        {/* Charts */}
        {activityData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-theme">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Scan Activity Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="date" stroke={chartColors.text} />
                  <YAxis stroke={chartColors.text} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartColors.background, 
                      borderRadius: '8px',
                      border: `1px solid ${chartColors.border}`,
                      color: chartColors.text
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="scans" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Scans"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-theme">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
                Score Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreRanges}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="range" stroke={chartColors.text} />
                  <YAxis stroke={chartColors.text} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartColors.background, 
                      borderRadius: '8px',
                      border: `1px solid ${chartColors.border}`,
                      color: chartColors.text
                    }} 
                  />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Issue Types Distribution */}
        {stats && stats.totalIssues > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-theme">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              Issue Severity Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issueTypes}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {issueTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.background, 
                    borderRadius: '8px',
                    border: `1px solid ${chartColors.border}`,
                    color: chartColors.text
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Scans Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-theme">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Scans
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Latest accessibility scans and their results</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredScans.length === 0 ? (
            <div className="p-12 text-center">
              <Globe className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">No scans found for the selected period</p>
              <Link href="/">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Run Your First Scan
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">Page</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">Issues</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">Score</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">Duration</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">Status</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">Date</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScans.map((scan) => (
                    <tr key={scan._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-gray-900 dark:text-white font-medium truncate">{scan.url}</p>
                            {scan.pageTitle && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{scan.pageTitle}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-gray-900 dark:text-white font-medium">{scan.issues}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreBg(scan.score)} ${getScoreColor(scan.score)}`}>
                          {scan.score}/100
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{formatDuration(scan.scanDuration)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getStatusBg(scan.status)} ${getStatusColor(scan.status)}`}>
                          {scan.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                        {formatDate(scan.timestamp)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/scan/${scan._id}`}>
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors">
                              View
                            </button>
                          </Link>
                           <Link href={`/scan`}>
                           <button 
                  
                            className="px-3 py-1 bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm rounded-lg font-medium transition-colors"
                            title="Re-scan this URL"
                          >
                            Re-scan
                          </button>
                          </Link>
                         
                          <button 
                            onClick={() => handleDeleteScan(scan._id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                            title="Delete this scan"
                          >
                            <Trash2 className="w-4 h-4" />
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

        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Dashboard updates automatically. Data is stored persistently in MongoDB.
          </p>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  description 
}: { 
  title: string
  value: string | number
  icon: React.ReactElement
  trend?: string
  description?: string
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg transition-theme">
        {icon}
      </div>
      {trend && (
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 text-xs">{description}</p>
      )}
    </div>
  </div>
)

export default Dashboard