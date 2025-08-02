import { AlertCircle, AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Copy, ExternalLink, EyeOff, XCircle } from 'lucide-react'
import React, { useState } from 'react'

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

interface IssueItemProps {
  issue: Issue
  isExpanded?: boolean
  onToggle?: (issueId: string) => void
  showActions?: boolean
  onMarkResolved?: (issueId: string) => void
  onIgnore?: (issueId: string) => void
  isResolved?: boolean
  isIgnored?: boolean
}

export default function IssueItem({
  issue,
  isExpanded = false,
  onToggle,
  showActions = false,
  onMarkResolved,
  onIgnore,
  isResolved = false,
  isIgnored = false
}: IssueItemProps) {
  const [copied, setCopied] = useState(false)

  const severityConfig = {
    critical: {
      label: 'Critical',
      icon: XCircle,
      className: 'severity-critical',
      bgClass: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800',
      color: 'text-red-700 dark:text-red-400',
      badgeClass: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
    },
    serious: {
      label: 'Serious',
      icon: AlertCircle,
      className: 'severity-serious',
      bgClass: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800',
      color: 'text-orange-700 dark:text-orange-400',
      badgeClass: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
    },
    moderate: {
      label: 'Moderate',
      icon: AlertTriangle,
      className: 'severity-moderate',
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800',
      color: 'text-yellow-700 dark:text-yellow-400',
      badgeClass: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
    },
    minor: {
      label: 'Minor',
      icon: CheckCircle,
      className: 'severity-minor',
      bgClass: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800',
      color: 'text-blue-700 dark:text-blue-400',
      badgeClass: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
    }
  }

  const config = severityConfig[issue.severity]
  const Icon = config.icon

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleToggle = () => {
    if (onToggle) {
      onToggle(issue.id)
    }
  }

  const handleMarkResolved = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMarkResolved) {
      onMarkResolved(issue.id)
    }
  }

  const handleIgnore = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onIgnore) {
      onIgnore(issue.id)
    }
  }

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-lg border overflow-hidden transition-all duration-200
        ${config.bgClass} 
        ${isResolved ? 'opacity-60' : ''} 
        ${isIgnored ? 'opacity-40' : ''}
      `}
    >
      {/* Issue Header */}
      <div
        className="p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        onClick={handleToggle}
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
              <div className="flex items-center space-x-2 mb-1 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {issue.title}
                  {isResolved && <span className="ml-2 text-green-600 dark:text-green-400 text-sm">(Resolved)</span>}
                  {isIgnored && <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">(Ignored)</span>}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.badgeClass}`}>
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

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center space-x-2 ml-4">
              {!isResolved && (
                <button
                  onClick={handleMarkResolved}
                  className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-md transition-colors"
                  title="Mark as resolved"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              
              {!isIgnored && (
                <button
                  onClick={handleIgnore}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Ignore issue"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
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
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-200 break-all">
                    {issue.selector}
                  </code>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(issue.selector)
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                    title="Copy selector"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">How to Fix</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{issue.solution}</p>
              
              <div className="flex items-center space-x-2">
                <a
                  href={issue.learnMore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1 transition-colors"
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

            {/* Additional metadata */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Issue ID: {issue.id}</span>
                <span>Severity: {issue.severity.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}