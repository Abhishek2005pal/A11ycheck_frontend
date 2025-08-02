'use client'

import { AlertCircle, AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Copy, Download, ExternalLink, Eye, Search, XCircle } from 'lucide-react'
import { useState } from 'react'

interface Issue {
  id: string
  title: string
  description: string
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  wcagGuideline: string
  wcagLevel: 'A' | 'AA' | 'AAA'
  element: string
  selector: string
  impact: string
  solution: string
  learnMore: string
  occurrences: number
  tags: string[]
}

interface IssueListProps {
  issues: Issue[]
  website: string
}

export default function IssueList({ issues, website }: IssueListProps) {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedWcagLevel, setSelectedWcagLevel] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'summary'>('list')

  const severityConfig = {
    critical: {
      label: 'Critical',
      icon: XCircle,
      className: 'severity-critical',
      bgClass: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800',
      color: 'text-red-700 dark:text-red-400'
    },
    serious: {
      label: 'Serious',
      icon: AlertCircle,
      className: 'severity-serious',
      bgClass: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800',
      color: 'text-orange-700 dark:text-orange-400'
    },
    moderate: {
      label: 'Moderate',
      icon: AlertTriangle,
      className: 'severity-moderate',
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800',
      color: 'text-yellow-700 dark:text-yellow-400'
    },
    minor: {
      label: 'Minor',
      icon: CheckCircle,
      className: 'severity-minor',
      bgClass: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800',
      color: 'text-blue-700 dark:text-blue-400'
    }
  }

  const toggleIssue = (issueId: string) => {
    const newExpanded = new Set(expandedIssues)
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId)
    } else {
      newExpanded.add(issueId)
    }
    setExpandedIssues(newExpanded)
  }

  const filteredIssues = issues.filter(issue => {
    const matchesSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity
    const matchesWcag = selectedWcagLevel === 'all' || issue.wcagLevel === selectedWcagLevel
    const matchesSearch = searchTerm === '' || 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.wcagGuideline.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSeverity && matchesWcag && matchesSearch
  })

  const issueCountsBySeverity = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportIssues = () => {
    const data = {
      website,
      scanDate: new Date().toISOString(),
      totalIssues: issues.length,
      issuesBySeverity: issueCountsBySeverity,
      issues: filteredIssues
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `accessibility-report-${website.replace(/https?:\/\//, '').replace(/\W+/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Issues Found!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Congratulations! This website appears to have excellent accessibility.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Accessibility Issues ({filteredIssues.length})
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Found {issues.length} total issues on {website}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'summary' : 'list')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>{viewMode === 'list' ? 'Summary View' : 'Detail View'}</span>
          </button>
          
          <button
            onClick={exportIssues}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(severityConfig).map(([severity, config]) => {
          const count = issueCountsBySeverity[severity] || 0
          const Icon = config.icon
          
          return (
            <div key={severity} className={`bg-white dark:bg-gray-800 rounded-lg border p-4 ${config.bgClass}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {config.label}
                  </p>
                  <p className={`text-2xl font-bold ${config.color}`}>
                    {count}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${config.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="serious">Serious</option>
              <option value="moderate">Moderate</option>
              <option value="minor">Minor</option>
            </select>
            
            <select
              value={selectedWcagLevel}
              onChange={(e) => setSelectedWcagLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All WCAG Levels</option>
              <option value="A">Level A</option>
              <option value="AA">Level AA</option>
              <option value="AAA">Level AAA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => {
          const isExpanded = expandedIssues.has(issue.id)
          const config = severityConfig[issue.severity]
          const Icon = config.icon

          return (
            <div key={issue.id} className={`bg-white dark:bg-gray-800 rounded-lg border overflow-hidden ${config.bgClass}`}>
              {/* Issue Header */}
              <div
                className="p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => toggleIssue(issue.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    <Icon className={`w-5 h-5 mt-1 flex-shrink-0 ${config.color}`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {issue.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} bg-current bg-opacity-10`}>
                          {config.label}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          WCAG {issue.wcagLevel}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {issue.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{issue.wcagGuideline}</span>
                        <span>•</span>
                        <span>{issue.occurrences} occurrence{issue.occurrences !== 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>{issue.element}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-4 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Impact</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{issue.impact}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Element</h4>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                            {issue.selector}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(issue.selector)
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Solution</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{issue.solution}</p>
                      
                      <div className="flex items-center space-x-2">
                        <a
                          href={issue.learnMore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Learn more</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    
                    {issue.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {issue.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}