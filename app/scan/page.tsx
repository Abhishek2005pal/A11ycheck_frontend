'use client'
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle, CheckCircle2, Clock, ExternalLink, Eye, Globe, Info, Mail, Monitor, RotateCcw, Settings, Smartphone, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import API_BASE_URL from '../config/api'
interface ScanIssue {
  id: number
  type: string
  description: string
  severity: 'error' | 'warning' | 'info'
  selector?: string
  code?: string
  context?: string
}

interface ScanResult {
  _id?: string
  url: string
  score: number
  issues: ScanIssue[]
  status: string
  timestamp: string
  scanDuration?: number
  pageTitle?: string
  pageDescription?: string
}

interface ScanHistoryItem {
  url: string
  score: number
  timestamp: string
}

// Fixed particle positions to prevent hydration error
const particlePositions = [
  { top: 10, left: 15, delay: 0.5, duration: 3 },
  { top: 20, left: 85, delay: 1.2, duration: 2.5 },
  { top: 30, left: 60, delay: 2.1, duration: 3.5 },
  { top: 40, left: 25, delay: 0.8, duration: 2.8 },
  { top: 50, left: 75, delay: 1.8, duration: 3.2 },
  { top: 60, left: 40, delay: 2.5, duration: 2.3 },
  { top: 70, left: 90, delay: 0.3, duration: 4 },
  { top: 80, left: 10, delay: 1.5, duration: 2.7 },
  { top: 35, left: 55, delay: 2.8, duration: 3.8 },
  { top: 25, left: 70, delay: 0.9, duration: 3.1 },
  { top: 55, left: 20, delay: 1.7, duration: 2.9 },
  { top: 75, left: 80, delay: 2.2, duration: 3.4 },
  { top: 15, left: 45, delay: 0.6, duration: 2.6 },
  { top: 65, left: 30, delay: 1.9, duration: 3.7 },
  { top: 85, left: 65, delay: 2.7, duration: 2.4 },
  { top: 45, left: 15, delay: 1.1, duration: 3.3 },
  { top: 5, left: 95, delay: 2.4, duration: 2.8 },
  { top: 95, left: 5, delay: 0.7, duration: 3.6 },
  { top: 25, left: 35, delay: 1.6, duration: 2.5 },
  { top: 75, left: 50, delay: 2.3, duration: 3.9 }
]

export default function ScanPage() {
  const [url, setUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanType, setScanType] = useState<'quick' | 'full'>('full')
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop')
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([])
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isEmailSending, setIsEmailSending] = useState<boolean>(false)

  // const API_BASE = 'http://localhost:4000'

  // Theme management
  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage?.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else if (typeof window !== 'undefined') {
      // Check system preference
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }

    // Check for authentication token
    const storedToken = localStorage?.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark')
        localStorage?.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage?.setItem('theme', 'light')
      }
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  // Navigate to dashboard
  const navigateToDashboard = () => {
    if (isLoggedIn) {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/login'
    }
  }

  // Create authenticated fetch function
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const authHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    }

    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers: authHeaders
    })

    // Handle unauthorized access
    if (response.status === 401 && token) {
      localStorage?.removeItem('token')
      setToken(null)
      setIsLoggedIn(false)
      alert('Session expired. Please login again.')
      throw new Error('Session expired. Please login again.')
    }

    if (!response.ok && response.status !== 401) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
  }

  // Save to scan history (only for logged-in users)
  const saveScanHistory = (scanData: ScanResult) => {
    if (isLoggedIn) {
      const newHistory: ScanHistoryItem[] = [
        { url: scanData.url, score: scanData.score, timestamp: scanData.timestamp },
        ...scanHistory.slice(0, 2) // Keep only last 3 including new one
      ]
      setScanHistory(newHistory)
    }
  }

  // Email scan results function (only for logged-in users)
  const handleEmailResults = async () => {
    if (!result || !isLoggedIn) {
      alert('Please log in to email scan results.')
      return
    }
    
    setIsEmailSending(true)
    
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/email-scan-results`, {
        method: 'POST',
        body: JSON.stringify({ 
          scanId: result._id,
          url: result.url,
          score: result.score,
          totalIssues: result.issues.length
        })
      })

      if (response.ok) {
        alert('Scan results have been emailed to your registered email address!')
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Email failed:', error)
      alert('Failed to send email. Please try again later.')
    } finally {
      setIsEmailSending(false)
    }
  }

  const handleScan = async () => {
    if (!url) return
    
    setIsLoading(true)
    setCurrentStep(1)
    setShowSuccess(false)
    setResult(null)

    try {
      // Simulate scan progress
      setTimeout(() => setCurrentStep(2), 1000)
      
      // For guests, we'll show mock data but still try to call the API if user is logged in
      if (isLoggedIn) {
        try {
          // Call your actual backend API for logged-in users
          const response = await authenticatedFetch(`${API_BASE_URL}/scan`, {
            method: 'POST',
            body: JSON.stringify({ 
              url: url,
              scanType: scanType,
              deviceType: deviceType 
            })
          })

          if (response.ok) {
            const scanResult = await response.json()
            
            // Format the result to match your interface
            const formattedResult: ScanResult = {
              _id: scanResult._id || scanResult.id,
              url: scanResult.url,
              score: scanResult.score,
              issues: scanResult.issueDetails || scanResult.issues || [],
              status: scanResult.status || 'completed',
              timestamp: scanResult.timestamp || new Date().toISOString(),
              scanDuration: scanResult.scanDuration,
              pageTitle: scanResult.pageTitle,
              pageDescription: scanResult.pageDescription
            }
            
            setResult(formattedResult)
            setCurrentStep(3)
            setShowSuccess(true)
            saveScanHistory(formattedResult)
            return
          }
        } catch (err) {
          console.error('API call failed, falling back to mock data:', err)
        }
      }

      // Fallback mock data for guests or when API fails
      const mockResult: ScanResult = {
        _id: isLoggedIn ? 'temp-' + Date.now() : undefined,
        url: url,
        score: Math.floor(Math.random() * 40) + 60,
        issues: [
          {
            id: 1,
            type: 'Missing alt text',
            description: 'Img element missing an alt attribute. Use the alt attribute to specify a short text alternative.',
            severity: 'error' as const,
            selector: 'html > body > header > img.logo',
            code: 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37',
            context: '<img src="/images/logo.png" class="logo">'
          },
          {
            id: 2,
            type: 'Low color contrast',
            description: 'This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least 4.5:1, but text in this element has a contrast ratio of 2.3:1.',
            severity: 'error' as const,
            selector: 'html > body > main > .text-gray-400',
            code: 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail',
            context: '<p class="text-gray-400">This text is hard to read</p>'
          },
          {
            id: 3,
            type: 'Missing form labels',
            description: 'This form control does not have a label. Form controls should have labels that clearly describe the control\'s purpose.',
            severity: 'error' as const,
            selector: 'html > body > main > form > input[type="email"]',
            code: 'WCAG2AA.Principle1.Guideline1_3.1_3_1.F68',
            context: '<input type="email" placeholder="Enter email">'
          },
          {
            id: 4,
            type: 'Improper heading structure',
            description: 'Heading markup should be used if this content is intended as a heading.',
            severity: 'warning' as const,
            selector: 'html > body > main > div.title',
            code: 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H42',
            context: '<div class="title text-2xl font-bold">Welcome</div>'
          },
          {
            id: 5,
            type: 'Missing iframe title',
            description: 'Iframe element requires a non-empty title attribute that identifies the frame.',
            severity: 'error' as const,
            selector: 'html > body > main > iframe',
            code: 'WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1',
            context: '<iframe src="https://example.com/embed"></iframe>'
          }
        ],
        status: 'completed',
        timestamp: new Date().toISOString(),
        scanDuration: 3000,
        pageTitle: 'Sample Page'
      }
      
      setResult(mockResult)
      setCurrentStep(3)
      setShowSuccess(true)
      saveScanHistory(mockResult)
      
      // Show different messages for guests vs logged-in users
      if (!isLoggedIn) {
        console.log('Showing demo results for guest user')
      }
      
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setShowSuccess(false)
    setCurrentStep(0)
    setUrl('')
  }

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-emerald-500 dark:text-emerald-400'
    if (score >= 75) return 'text-amber-500 dark:text-amber-400'
    return 'text-red-500 dark:text-red-400'
  }

  const getScoreGradient = (score: number): string => {
    if (score >= 90) return 'from-emerald-500/20 to-green-600/20 dark:from-emerald-500/30 dark:to-green-600/30'
    if (score >= 75) return 'from-amber-500/20 to-yellow-600/20 dark:from-amber-500/30 dark:to-yellow-600/30'
    return 'from-red-500/20 to-orange-600/20 dark:from-red-500/30 dark:to-orange-600/30'
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
      default:
        return <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const steps = [
    { title: 'Enter URL', icon: Globe },
    { title: 'Scanning', icon: Settings },
    { title: 'Complete', icon: CheckCircle2 }
  ]

  // Get top 3 critical issues for preview - prioritize errors first
  const getTopIssues = (issues: ScanIssue[], limit = 3) => {
    return issues
      .sort((a, b) => {
        // Sort by severity: errors first, then warnings, then others
        const severityOrder = { 'error': 0, 'warning': 1, 'info': 2 }
        const aSeverity = severityOrder[a.severity] ?? 3
        const bSeverity = severityOrder[b.severity] ?? 3
        return aSeverity - bSeverity
      })
      .slice(0, limit)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 text-gray-900 dark:text-white relative overflow-hidden transition-all duration-300">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -left-60 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/3 dark:bg-cyan-500/5 rounded-full blur-3xl animate-ping"></div>
        
        {/* Fixed floating particles */}
        {mounted && particlePositions.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 dark:bg-blue-400/30 rounded-full animate-bounce"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 dark:from-blue-300 dark:via-cyan-300 dark:to-sky-300 bg-clip-text text-transparent animate-pulse">
            A11yCheck
          </h1>
          <p className="text-2xl text-blue-700 dark:text-blue-200 font-light transition-colors duration-300">Test Website Accessibility</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 mx-auto mt-4 rounded-full"></div>
          
          {/* Login Status Indicator */}
          <div className="mt-4">
            {isLoggedIn ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                <CheckCircle className="w-4 h-4 mr-1" />
                Logged In - Full Features Available
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                <Info className="w-4 h-4 mr-1" />
                Guest Mode - Limited Preview
              </span>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-center items-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index <= currentStep
              const isCompleted = index < currentStep
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-blue-500 text-white animate-pulse' 
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm mt-2 transition-colors duration-300 ${
                    isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mt-2 transition-colors duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-500/30 rounded-xl flex items-center justify-center animate-bounce max-w-4xl mx-auto transition-colors duration-300">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-700 dark:text-green-300 font-medium">
              {isLoggedIn ? 'Scan completed successfully!' : 'Demo scan completed! Login for full features.'}
            </span>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-8">
            {/* Configuration Row */}
            <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 rounded-3xl p-6 shadow-2xl transition-all duration-300">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white transition-colors duration-300">Scan Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* URL Input */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Website URL</label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
                      disabled={isLoading}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    />
                    {showTooltip && (
                      <div className="absolute -top-12 left-0 bg-gray-800 dark:bg-slate-700 text-white text-xs rounded-lg px-3 py-2 z-10">
                        <Info className="inline w-3 h-3 mr-1" />
                        {isLoggedIn ? 'We\'ll analyze your site for accessibility issues using Pa11y' : 'Demo mode - shows sample accessibility issues'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Scan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Scan Type</label>
                  <select
                    value={scanType}
                    onChange={(e) => setScanType(e.target.value as 'quick' | 'full')}
                    className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
                    disabled={isLoading}
                  >
                    <option value="quick">Quick Scan (2-3 min)</option>
                    <option value="full">Full Scan (5-10 min)</option>
                  </select>
                </div>

                {/* Device Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Device</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setDeviceType('desktop')}
                      className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-all duration-300 ${
                        deviceType === 'desktop' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                      disabled={isLoading}
                    >
                      <Monitor className="w-4 h-4 mr-1" />
                      Desktop
                    </button>
                    <button
                      onClick={() => setDeviceType('mobile')}
                      className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-all duration-300 ${
                        deviceType === 'mobile' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                      disabled={isLoading}
                    >
                      <Smartphone className="w-4 h-4 mr-1" />
                      Mobile
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleScan}
                  disabled={!url || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
                      {scanType === 'quick' ? 'Quick Scanning...' : 'Full Scanning...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Start {scanType === 'quick' ? 'Quick' : 'Full'} Scan
                      {!isLoggedIn && <span className="ml-2 text-xs opacity-75">(Demo)</span>}
                    </>
                  )}
                </button>

                {result && (
                  <>
                    <button
                      onClick={handleReset}
                      className="bg-gray-500 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      New Scan
                    </button>
                    <button
                      onClick={navigateToDashboard}
                      className="bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Dashboard
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Results Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Scan History - Only show if logged in and has history */}
              {isLoggedIn && scanHistory.length > 0 && (
                <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 rounded-3xl p-6 shadow-2xl transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center transition-colors duration-300">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Scans
                  </h3>
                  <div className="space-y-3">
                    {scanHistory.map((scan, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 mr-2">
                            {scan.url}
                          </div>
                          <div className={`text-sm font-medium ${getScoreColor(scan.score)}`}>
                            {scan.score}/100
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(scan.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Section */}
              <div className={`${isLoggedIn && scanHistory.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                {result ? (
                  <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 rounded-3xl p-8 shadow-2xl transition-all duration-300">
                    {/* Header with guest/user context */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                          {isLoggedIn ? 'Scan Results' : 'Demo Scan Results'}
                        </h2>
                        {!isLoggedIn && (
                          <span className="ml-3 px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                            PREVIEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-center mb-4">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-300 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">{result.url}</span>
                      </div>
                      {result._id && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          Scan ID: {result._id}
                        </div>
                      )}
                      {!isLoggedIn && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 mb-4">
                          <p className="text-blue-700 dark:text-blue-300 text-sm">
                            <Info className="inline w-4 h-4 mr-1" />
                            This is a demo showing sample accessibility issues. Login for real Pa11y analysis.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Score Display */}
                    <div className={`bg-gradient-to-br ${getScoreGradient(result.score)} rounded-2xl p-6 mb-6`}>
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
                          {result.score}
                          <span className="text-3xl">/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 mb-4">
                          <div 
                            className={`h-4 rounded-full transition-all duration-1000 ${
                              result.score >= 90 ? 'bg-emerald-500' : 
                              result.score >= 75 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${result.score}%` }}
                          />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          {result.score >= 90 ? 'Excellent accessibility!' : 
                           result.score >= 75 ? 'Good accessibility with room for improvement' : 
                           'Needs significant accessibility improvements'}
                        </p>
                      </div>
                    </div>

                    {/* Issues Preview - Show top 3 issues for both guests and users */}
                    {result.issues && result.issues.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                            {isLoggedIn ? `Top Issues (${getTopIssues(result.issues, 3).length} of ${result.issues.length})` : 'Sample Issues Preview'}
                          </h3>
                          {isLoggedIn && result.issues.length > 3 && (
                            <button
                              onClick={navigateToDashboard}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm flex items-center transition-colors duration-300"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View All Issues
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {getTopIssues(result.issues, 3).map((issue) => (
                            <div key={issue.id} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border-l-4 border-red-400/60 transition-colors duration-300">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  {getSeverityIcon(issue.severity)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      issue.severity === 'error' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' : 
                                      issue.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                                      'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                                    }`}>
                                      {issue.severity?.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 font-medium">{issue.type}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{issue.description}</p>
                                  {issue.selector && (
                                    <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-600/50 rounded px-2 py-1 mb-2 transition-colors duration-300">
                                      <span className="font-medium">Element:</span> {issue.selector}
                                    </div>
                                  )}
                                  {issue.code && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      <span className="font-medium">WCAG Code:</span> {issue.code}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Show different context for guests vs logged-in users */}
                        {isLoggedIn && result.issues.length > 3 && (
                          <div className="mt-4 text-center">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-700 dark:text-blue-300 text-sm">
                              <Info className="w-4 h-4 mr-2" />
                              {result.issues.length - 3} more issues found. View full report in dashboard.
                            </div>
                          </div>
                        )}
                        
                        {!isLoggedIn && (
                          <div className="mt-4 text-center">
                            <div className="inline-flex items-center px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-700 dark:text-amber-300 text-sm">
                              <Info className="w-4 h-4 mr-2" />
                              This is a sample of what accessibility issues look like. Login for real analysis.
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons - Different for guests vs logged-in users */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {isLoggedIn ? (
                        <>
                          <button
                            onClick={navigateToDashboard}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center"
                          >
                            <ArrowRight className="w-5 h-5 mr-2" />
                            View Full Report in Dashboard
                          </button>
                          <button
                            onClick={handleEmailResults}
                            disabled={isEmailSending}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center"
                          >
                            {isEmailSending ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="w-5 h-5 mr-2" />
                                Email Results
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => window.location.href = '/login'}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center"
                          >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Login to View Full Report & Dashboard
                          </button>
                          <button
                            onClick={() => window.location.href = '/signup'}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Sign Up for Free Account
                          </button>
                        </>
                      )}
                    </div>

                    {/* Guest CTA */}
                    {!isLoggedIn && (
                      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          🚀 Unlock Full Accessibility Testing
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Get real Pa11y analysis, detailed WCAG compliance reports, scan history, email results, and more!
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <button
                            onClick={() => window.location.href = '/signup'}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                          >
                            Create Free Account
                          </button>
                          <button
                            onClick={() => window.location.href = '/login'}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                          >
                            Login
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-600 rounded-3xl p-8 shadow-2xl text-center transition-all duration-300">
                    <div className="text-gray-600 dark:text-gray-300 mb-4">
                      <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Scan</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {isLoading 
                          ? (isLoggedIn ? 'Analyzing your website for accessibility issues using Pa11y...' : 'Preparing demo scan results...')
                          : 'Enter a website URL and configure your scan settings to get started.'
                        }
                      </p>
                      {!isLoggedIn && !isLoading && (
                        <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4">
                          <p className="text-amber-700 dark:text-amber-300 text-sm">
                            💡 <strong>Guest Mode:</strong> You'll see demo results showing what accessibility issues look like.
                            <br />
                            <strong>Login</strong> to get real Pa11y analysis, save results, and access the full dashboard.
                          </p>
                        </div>
                      )}
                    </div>
                    {isLoading && (
                      <div className="mt-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400/30 border-t-blue-400 mx-auto"></div>
                        <p className="text-blue-600 dark:text-blue-400 mt-4">
                          {isLoggedIn 
                            ? (scanType === 'quick' ? 'Quick scan in progress...' : 'Full scan in progress...')
                            : 'Preparing demo results...'
                          }
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                          {isLoggedIn ? 'This may take a few moments...' : 'Demo will load shortly...'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}