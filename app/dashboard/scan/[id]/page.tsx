'use client'

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Info,
  Lightbulb,
  Loader,
  Target,
  Timer,
  Users,
  XCircle,
  Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

// REMOVE localStorage usage for theme (not supported in artifacts)
const useTheme = () => {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Remove localStorage usage
    setTheme('light')
  }, [])

  return { theme, mounted }
}

// Types based on your backend
interface ScanResult {
  id: string
  url: string
  issues: number
  score: number
  status: string
  timestamp: string
  scanDuration: number
  pageTitle?: string
  pageDescription?: string
  issueDetails: IssueDetail[]
}

interface IssueDetail {
  id: number
  type: string
  severity: string
  selector: string
  message: string
  code: string
  context: string
}

interface EnhancedIssue extends IssueDetail {
  plainEnglish: string
  impact: 'High' | 'Medium' | 'Low'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  affectedUsers: string[]
  wcagGuideline: string
  wcagLevel: 'A' | 'AA' | 'AAA'
  category: string
  solution: {
    description: string
    steps: string[]
    codeExample: {
      before: string
      after: string
    }
    resources: Array<{ title: string; url: string }>
  }
}

// Enhancement functions (keeping the same)
const enhanceIssue = (issue: IssueDetail): EnhancedIssue => {
  const getPlainEnglish = (message: string, code: string): string => {
    if (code.includes('Colour') || code.includes('color')) 
      return 'Text color may not have enough contrast against the background, making it hard to read.'
    if (code.includes('EmptyHeading')) 
      return 'This heading is empty and should contain text or be removed.'
    if (code.includes('MissingAlt') || message.toLowerCase().includes('alt')) 
      return 'This image is missing alternative text that describes what it shows.'
    if (code.includes('MissingLabel') || message.toLowerCase().includes('label')) 
      return 'This form field is missing a label that tells users what to enter.'
    if (message.toLowerCase().includes('duplicate id'))
      return 'Multiple elements have the same ID, which can confuse screen readers.'
    return message.length > 80 ? message.substring(0, 80) + '...' : message
  }

  const getCategory = (code: string, message: string): string => {
    if (code.includes('Colour') || code.includes('Color') || message.toLowerCase().includes('contrast')) 
      return 'Visual Design'
    if (code.includes('Form') || code.includes('Label') || message.toLowerCase().includes('form')) 
      return 'Forms'
    if (code.includes('Link') || code.includes('Navigation') || message.toLowerCase().includes('link')) 
      return 'Navigation'
    if (code.includes('Heading') || code.includes('Structure') || message.toLowerCase().includes('heading')) 
      return 'HTML Structure'
    return 'General'
  }

  const getWcagInfo = (code: string) => {
    const wcagMatch = code.match(/WCAG2AA\.Principle(\d)\.Guideline(\d_\d_\d)/)
    if (wcagMatch) {
      return {
        guideline: `${wcagMatch[1]}.${wcagMatch[2].replace(/_/g, '.')}`,
        level: 'AA' as const
      }
    }
    return { guideline: 'Unknown', level: 'A' as const }
  }

  const getImpact = (severity: string, code: string): 'High' | 'Medium' | 'Low' => {
    if (severity === 'error') return 'High'
    if (code.includes('Colour') || code.includes('Heading')) return 'Medium'
    return 'Low'
  }

  const getDifficulty = (code: string, message: string): 'Easy' | 'Medium' | 'Hard' => {
    if (code.includes('Alt') || code.includes('Label') || message.toLowerCase().includes('alt') || message.toLowerCase().includes('label')) 
      return 'Easy'
    if (code.includes('Colour') || code.includes('Structure') || message.toLowerCase().includes('contrast')) 
      return 'Medium'
    return 'Hard'
  }

  const getSolution = (code: string, message: string) => {
    if (code.includes('Colour') || message.toLowerCase().includes('contrast')) {
      return {
        description: "Ensure text has sufficient color contrast ratio (4.5:1 for normal text, 3:1 for large text)",
        steps: [
          "Use a color contrast checker tool to test current colors",
          "Adjust either text color or background color",
          "Aim for at least 4.5:1 contrast ratio",
          "Test with actual users if possible"
        ],
        codeExample: {
          before: `/* Poor contrast */\n.text {\n  color: #999999;\n  background: #ffffff;\n}`,
          after: `/* Good contrast */\n.text {\n  color: #333333;\n  background: #ffffff;\n}`
        },
        resources: [
          { title: "WebAIM Color Contrast Checker", url: "https://webaim.org/resources/contrastchecker/" },
          { title: "WCAG Color Guidelines", url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" }
        ]
      }
    }

    if (code.includes('Alt') || message.toLowerCase().includes('alt')) {
      return {
        description: "Add descriptive alternative text to images so screen readers can convey the image content",
        steps: [
          "Identify the purpose and content of the image",
          "Write concise, descriptive alt text (usually under 100 characters)",
          "Use empty alt=\"\" for purely decorative images",
          "Test with screen reader to ensure it makes sense"
        ],
        codeExample: {
          before: `<img src="chart.png">`,
          after: `<img src="chart.png" alt="Sales increased 25% from Q1 to Q2 2024">`
        },
        resources: [
          { title: "Alt Text Guide", url: "https://webaim.org/articles/alt/" },
          { title: "WCAG Images Guidelines", url: "https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html" }
        ]
      }
    }

    return {
      description: "This accessibility issue needs to be addressed to improve user experience",
      steps: [
        "Review the WCAG guidelines for this issue type",
        "Implement the recommended fix",
        "Test the change with accessibility tools",
        "Verify with real users if possible"
      ],
      codeExample: {
        before: "// Current implementation needs improvement",
        after: "// Improved accessible implementation"
      },
      resources: [
        { title: "WCAG Guidelines", url: "https://www.w3.org/WAI/WCAG21/" },
        { title: "WebAIM Resources", url: "https://webaim.org/" }
      ]
    }
  }

  const wcagInfo = getWcagInfo(issue.code)
  const difficulty = getDifficulty(issue.code, issue.message)

  return {
    ...issue,
    plainEnglish: getPlainEnglish(issue.message, issue.code),
    impact: getImpact(issue.severity, issue.code),
    difficulty,
    estimatedTime: difficulty === 'Easy' ? '2-5 minutes' : difficulty === 'Medium' ? '10-30 minutes' : '1-2 hours',
    affectedUsers: ["Screen reader users", "Keyboard navigation users", "Users with visual impairments"],
    wcagGuideline: wcagInfo.guideline,
    wcagLevel: wcagInfo.level,
    category: getCategory(issue.code, issue.message),
    solution: getSolution(issue.code, issue.message)
  }
}

interface Props {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function RealScanReport({ params, searchParams }: Props) {
  const { theme, mounted } = useTheme()
  const [scanData, setScanData] = useState<ScanResult | null>(null)
  const [enhancedIssues, setEnhancedIssues] = useState<EnhancedIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedIssues, setExpandedIssues] = useState<Record<string, boolean>>({})
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showFixGuide, setShowFixGuide] = useState<boolean>(false)
  const [exportFormat, setExportFormat] = useState<string>('pdf')
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false)

  // Fixed scanId initialization
  const [scanId, setScanId] = useState<string>('')

  // Handle params resolution
  useEffect(() => {
    const getParamsData = async () => {
      try {
        const resolvedParams = await params
        console.log('Resolved params:', resolvedParams) // Debug log
        if (resolvedParams.id) {
          setScanId(resolvedParams.id)
          console.log('Set scanId to:', resolvedParams.id) // Debug log
        } else {
          // Fallback - extract from URL
          const pathParts = window.location.pathname.split('/')
          const urlId = pathParts[pathParts.length - 1]
          if (urlId && urlId !== 'scan') {
            setScanId(urlId)
            console.log('Set scanId from URL to:', urlId) // Debug log
          } else {
            setError('No scan ID found in URL')
          }
        }
      } catch (error) {
        console.error('Error resolving params:', error)
        setError('Error getting scan ID from URL')
      }
    }
    
    getParamsData()
  }, [params])

  // Fetch data when scanId changes
  useEffect(() => {
    if (scanId) {
      console.log('Fetching data for scanId:', scanId) // Debug log
      fetchScanData()
    }
  }, [scanId])

  const fetchScanData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting fetch for scanId:', scanId) // Debug log
      
      // Build the API URL
      const apiUrl = `http://localhost:4000/scan/${scanId}`
      console.log('API URL:', apiUrl) // Debug log
      
      // Get token (try multiple possible keys)
      let token = null
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('authToken') || 
               localStorage.getItem('token') || 
               localStorage.getItem('accessToken') ||
               localStorage.getItem('jwt')
      }
      
      console.log('Auth token found:', !!token) // Debug log (don't log actual token)
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      console.log('Making fetch request...') // Debug log
      const response = await fetch(apiUrl, { 
        headers,
        method: 'GET'
      })
      
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      }) // Debug log
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText) // Debug log
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch scan data'}`)
      }

      const data: ScanResult = await response.json()
      console.log('Parsed JSON data:', data) // Debug log
      
      setScanData(data)
      
      // Enhance issues
      if (data.issueDetails && data.issueDetails.length > 0) {
        const enhanced = data.issueDetails.map(issue => enhanceIssue(issue))
        setEnhancedIssues(enhanced)
        console.log('Enhanced issues:', enhanced.length) // Debug log
      } else {
        setEnhancedIssues([])
        console.log('No issues found in scan') // Debug log
      }
      
    } catch (err) {
      console.error('Fetch error:', err) // Debug log
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching scan data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
  }

  const generateCSVData = () => {
    const headers = [
      'Issue #',
      'Severity',
      'Category',
      'Plain English Description',
      'Impact',
      'Difficulty',
      'Estimated Time',
      'WCAG Guideline',
      'Element Selector',
      'Technical Message',
      'Pa11y Code',
      'Solution Description'
    ]

    const rows = filteredIssues.map((issue, index) => [
      (index + 1).toString(),
      issue.severity,
      issue.category,
      issue.plainEnglish,
      issue.impact,
      issue.difficulty,
      issue.estimatedTime,
      `${issue.wcagGuideline} (${issue.wcagLevel})`,
      issue.selector,
      issue.message,
      issue.code,
      issue.solution.description
    ])

    return [headers, ...rows]
  }

  const exportToCSV = () => {
    const csvData = generateCSVData()
    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `accessibility-scan-${scanData?.id || 'report'}.csv`
    link.click()
  }

  const exportToPDF = () => {
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Accessibility Scan Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
          .issue { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; }
          .severity-error { border-left: 4px solid #dc2626; }
          .severity-warning { border-left: 4px solid #d97706; }
          .severity-notice { border-left: 4px solid #2563eb; }
          .code { background: #f8f8f8; padding: 10px; font-family: monospace; margin: 10px 0; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Accessibility Scan Report</h1>
          <p><strong>URL:</strong> ${scanData?.url}</p>
          <p><strong>Scan Date:</strong> ${scanData ? new Date(scanData.timestamp).toLocaleDateString() : ''}</p>
          <p><strong>Score:</strong> ${scanData?.score}/100</p>
        </div>
        
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Issues:</strong> ${filteredIssues.length}</p>
          <p><strong>Errors:</strong> ${filteredIssues.filter(i => i.severity === 'error').length}</p>
          <p><strong>Warnings:</strong> ${filteredIssues.filter(i => i.severity === 'warning').length}</p>
          <p><strong>Notices:</strong> ${filteredIssues.filter(i => i.severity === 'notice').length}</p>
        </div>

        ${filteredIssues.map((issue, index) => `
          <div class="issue severity-${issue.severity}">
            <h3>Issue ${index + 1}: ${issue.plainEnglish}</h3>
            <p><strong>Severity:</strong> ${issue.severity.toUpperCase()}</p>
            <p><strong>Category:</strong> ${issue.category}</p>
            <p><strong>Impact:</strong> ${issue.impact}</p>
            <p><strong>Difficulty:</strong> ${issue.difficulty}</p>
            <p><strong>Estimated Time:</strong> ${issue.estimatedTime}</p>
            <p><strong>WCAG Guideline:</strong> ${issue.wcagGuideline} (${issue.wcagLevel})</p>
            <p><strong>Element:</strong></p>
            <div class="code">${issue.selector}</div>
            <p><strong>Solution:</strong> ${issue.solution.description}</p>
            <p><strong>Steps to Fix:</strong></p>
            <ol>
              ${issue.solution.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        `).join('')}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p><small>Generated on ${new Date().toLocaleString()}</small></p>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([pdfContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const printWindow = window.open(url, '_blank')
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
          URL.revokeObjectURL(url)
        }, 500)
      }
    }
  }

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV()
    } else {
      exportToPDF()
    }
    setShowExportDropdown(false)
  }

  const toggleIssue = (issueId: string) => {
    setExpandedIssues(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
      case 'notice': return <Info className="w-4 h-4 text-blue-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'hard': return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'easy': return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  // Calculate statistics
  const errorCount = enhancedIssues.filter(i => i.severity === 'error').length
  const warningCount = enhancedIssues.filter(i => i.severity === 'warning').length
  const noticeCount = enhancedIssues.filter(i => i.severity === 'notice').length
  const totalEstimatedTime = enhancedIssues.reduce((acc, issue) => {
    const time = issue.difficulty === 'Easy' ? 5 : issue.difficulty === 'Medium' ? 20 : 90
    return acc + time
  }, 0)

  // Filter issues
  const filteredIssues = enhancedIssues.filter(issue => {
    const severityMatch = filterSeverity === 'all' || issue.severity === filterSeverity
    const categoryMatch = filterCategory === 'all' || issue.category.toLowerCase().includes(filterCategory)
    return severityMatch && categoryMatch
  })

  // Debug render
  console.log('Render state:', { loading, error, scanId, scanData: !!scanData, enhancedIssuesCount: enhancedIssues.length })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading scan results...</p>
          <p className="text-gray-400 text-sm mt-2">Scan ID: {scanId}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Scan</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm mb-4">Scan ID: {scanId}</p>
          <button 
            onClick={fetchScanData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Try Again
          </button>
          <button 
            onClick={handleBackToDashboard}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!scanData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Info className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Scan Data</h2>
          <p className="text-gray-600 dark:text-gray-400">No data available for this scan.</p>
          <p className="text-gray-400 text-sm mt-2">Scan ID: {scanId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 px-6 py-4 bg-white dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBackToDashboard}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accessibility Scan Report</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Pa11y automated accessibility testing results</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Format:</p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="exportFormat"
                          value="pdf"
                          checked={exportFormat === 'pdf'}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="mr-2"
                        />
                        <FileText className="w-4 h-4 mr-2 text-red-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">PDF Report</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="exportFormat"
                          value="csv"
                          checked={exportFormat === 'csv'}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="mr-2"
                        />
                        <FileText className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">CSV Data</span>
                      </label>
                    </div>
                    <button
                      onClick={handleExport}
                      className="w-full mt-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                    >
                      Export {exportFormat.toUpperCase()}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowFixGuide(!showFixGuide)}
              className={`flex items-center px-4 py-2 rounded font-medium ${
                showFixGuide ? 'bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showFixGuide ? 'Hide Guide' : 'Fix Guide'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Site Overview */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{scanData.url}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{scanData.pageTitle || 'No title available'}</p>
                <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(scanData.timestamp).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {(scanData.scanDuration / 1000).toFixed(1)}s
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    ID: {scanData.id}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{scanData.score}/100</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {scanData.score >= 90 ? 'Excellent' : scanData.score >= 70 ? 'Good' : scanData.score >= 50 ? 'Needs work' : 'Poor'}
              </p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scanData.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700'
                }`}>
                  {scanData.status.charAt(0).toUpperCase() + scanData.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">Errors</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{errorCount}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">Must fix</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{warningCount}</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">Should fix</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Notices</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{noticeCount}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Consider fixing</p>
                </div>
                <Info className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">Est. Fix Time</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{Math.round(totalEstimatedTime / 60)}h</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Total effort</p>
                </div>
                <Timer className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Fix Guide */}
        {showFixGuide && (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Quick Fix Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Errors (Critical)</h4>
                <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                  <li>• Fix immediately - blocks access</li>
                  <li>• Usually quick fixes (2-5 min each)</li>
                  <li>• Examples: Missing alt text, broken links</li>
                </ul>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Warnings</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li>• Improve user experience</li>
                  <li>• May require design changes</li>
                  <li>• Examples: Color contrast, structure</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Notices</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Enhanced accessibility</li>
                  <li>• Best practices</li>
                  <li>• Examples: ARIA labels, focus indicators</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity:</span>
              <select 
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All</option>
                <option value="error">Errors</option>
                <option value="warning">Warnings</option>
                <option value="notice">Notices</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All</option>
                <option value="visual">Visual Design</option>
                <option value="navigation">Navigation</option>
                <option value="forms">Forms</option>
                <option value="html">HTML Structure</option>
                <option value="general">General</option>
              </select>
            </div>
            {(filterCategory !== 'all' || filterSeverity !== 'all') && (
              <button
                onClick={() => {
                  setFilterCategory('all')
                  setFilterSeverity('all')
                }}
                className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Clear Filters
              </button>
            )}
            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredIssues.length} of {enhancedIssues.length} issues
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Issues & Solutions</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Click on any issue to see how to fix it</p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredIssues.length === 0 ? (
              <div className="p-12 text-center">
                <Info className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No issues found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filterCategory !== 'all' || filterSeverity !== 'all' 
                    ? 'Try adjusting your filters to see more results.'
                    : 'Great! No accessibility issues detected.'
                  }
                </p>
              </div>
            ) : (
              filteredIssues.map((issue, index) => (
                <div key={`issue-${issue.id}`} className="p-6">
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleIssue(`issue-${issue.id}`)}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          {getSeverityIcon(issue.severity)}
                          <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                            issue.severity === 'error' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                              : issue.severity === 'warning'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          }`}>
                            {issue.severity}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            WCAG {issue.wcagGuideline} ({issue.wcagLevel})
                          </span>
                        </div>
                        
                        <h4 className="text-gray-900 dark:text-white font-medium mb-2">{issue.plainEnglish}</h4>
                        
                        <div className="flex items-center space-x-4 text-xs">
                          <span className={`px-2 py-1 rounded ${getImpactColor(issue.impact)}`}>
                            {issue.impact} Impact
                          </span>
                          <span className={`px-2 py-1 rounded ${getDifficultyColor(issue.difficulty)}`}>
                            {issue.difficulty} Fix
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 flex items-center">
                            <Timer className="w-3 h-3 mr-1" />
                            {issue.estimatedTime}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {issue.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(issue.selector)
                        }}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Copy selector"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {expandedIssues[`issue-${issue.id}`] ? 
                        <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      }
                    </div>
                  </div>

                  {expandedIssues[`issue-${issue.id}`] && (
                    <div className="mt-6 ml-14 space-y-6">
                      {/* Pa11y Technical Details */}
                      <div className="bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Technical Details:</p>
                        <div className="space-y-2 text-sm">
                          <div><strong>Pa11y Code:</strong> <code className="text-blue-600 dark:text-blue-400">{issue.code}</code></div>
                          <div><strong>Element:</strong> <code className="text-blue-600 dark:text-blue-400 text-xs break-all">{issue.selector}</code></div>
                          <div><strong>Original Message:</strong> {issue.message}</div>
                          {issue.context && (
                            <div>
                              <strong>Context:</strong> 
                              <pre className="mt-1 p-2 bg-white dark:bg-slate-800 border rounded text-xs overflow-x-auto">
                                <code>{issue.context}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Affected Users */}
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Who This Affects
                        </h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {issue.affectedUsers.map((user, idx) => (
                            <li key={idx}>{user}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Solution */}
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                          How to Fix This
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{issue.solution.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Steps:</h6>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              {issue.solution.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>

                          {/* Code Example */}
                          <div>
                            <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                              <Code className="w-4 h-4 mr-1" />
                              Code Example:
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-red-600 dark:text-red-400 mb-2 font-medium">❌ Before:</p>
                                <pre className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-xs overflow-x-auto">
                                  <code className="text-gray-800 dark:text-gray-200">{issue.solution.codeExample.before}</code>
                                </pre>
                              </div>
                              <div>
                                <p className="text-xs text-green-600 dark:text-green-400 mb-2 font-medium">✅ After:</p>
                                <pre className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3 text-xs overflow-x-auto">
                                  <code className="text-gray-800 dark:text-gray-200">{issue.solution.codeExample.after}</code>
                                </pre>
                              </div>
                            </div>
                          </div>

                          {/* Resources */}
                          <div>
                            <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              Learn More:
                            </h6>
                            <div className="space-y-1">
                              {issue.solution.resources.map((resource, idx) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  {resource.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Plan */}
        {enhancedIssues.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Recommended Action Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {errorCount > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">1</div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Fix Critical Errors</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Address {errorCount} critical error{errorCount !== 1 ? 's' : ''} that prevent users from accessing content
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Est. time: {Math.round(enhancedIssues.filter(i => i.severity === 'error').reduce((acc, i) => acc + (i.difficulty === 'Easy' ? 5 : i.difficulty === 'Medium' ? 20 : 90), 0) / 60)} hours
                  </p>
                </div>
              )}
              {warningCount > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">2</div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Address Warnings</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Improve user experience by fixing {warningCount} warning{warningCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Est. time: {Math.round(enhancedIssues.filter(i => i.severity === 'warning').reduce((acc, i) => acc + (i.difficulty === 'Easy' ? 5 : i.difficulty === 'Medium' ? 20 : 90), 0) / 60)} hours
                  </p>
                </div>
              )}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">3</div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Test & Validate</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Test with screen readers and run another scan to verify improvements
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Est. time: 30 minutes</p>
              </div>
            </div>
            
            {/* Next Scan Button */}
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => window.location.href = '/scan'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
              >
                <Zap className="w-4 h-4 mr-2" />
                Run New Scan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}