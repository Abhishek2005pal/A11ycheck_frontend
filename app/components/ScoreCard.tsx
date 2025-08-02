'use client'

import { AlertTriangle, Award, CheckCircle, TrendingDown, TrendingUp, XCircle } from 'lucide-react'

interface ScoreCardProps {
  score: number
  previousScore?: number
  totalIssues: number
  criticalIssues: number
  website: string
  scanDate: string
  compliance: {
    wcag21AA: number
    wcag21AAA: number
    section508: number
  }
}

export default function ScoreCard({ 
  score, 
  previousScore, 
  totalIssues, 
  criticalIssues, 
  website, 
  scanDate,
  compliance 
}: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 50) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 70) return 'from-yellow-500 to-amber-500'
    if (score >= 50) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-pink-500'
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', label: 'Excellent' }
    if (score >= 80) return { grade: 'B', label: 'Good' }
    if (score >= 70) return { grade: 'C', label: 'Fair' }
    if (score >= 60) return { grade: 'D', label: 'Poor' }
    return { grade: 'F', label: 'Critical' }
  }

  const scoreChange = previousScore ? score - previousScore : 0
  const gradeInfo = getScoreGrade(score)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="card p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Accessibility Score
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analysis completed for <span className="font-medium text-blue-600 dark:text-blue-400">{website}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Scanned on {scanDate}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Score Circle */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative">
              {/* Circular progress */}
              <div className="w-40 h-40 lg:w-48 lg:h-48 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-200 dark:text-slate-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#scoreGradient)"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${score * 2.827} 282.7`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className={`${getScoreBgColor(score).split(' ')[0].replace('from-', 'text-')}`} />
                      <stop offset="100%" className={`${getScoreBgColor(score).split(' ')[2].replace('to-', 'text-')}`} />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl lg:text-5xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </span>
                  <span className="text-lg lg:text-xl font-medium text-gray-600 dark:text-gray-400">
                    / 100
                  </span>
                  <div className="mt-2 text-center">
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                      {gradeInfo.grade}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {gradeInfo.label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Score change indicator */}
              {previousScore && (
                <div className={`
                  absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium
                  ${scoreChange > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : scoreChange < 0 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                  }
                `}>
                  {scoreChange > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : scoreChange < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                  <span>
                    {scoreChange > 0 ? '+' : ''}{scoreChange} pts
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2 space-y-4">
            {/* Issue Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Issues
                  </span>
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalIssues}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Critical Issues
                  </span>
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {criticalIssues}
                </div>
              </div>
            </div>

            {/* Compliance Levels */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Compliance Levels</span>
              </h3>
              
              <div className="space-y-3">
                {/* WCAG 2.1 AA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${compliance.wcag21AA >= 80 ? 'bg-green-500' : compliance.wcag21AA >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      WCAG 2.1 AA
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          compliance.wcag21AA >= 80 ? 'bg-green-500' : compliance.wcag21AA >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${compliance.wcag21AA}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                      {compliance.wcag21AA}%
                    </span>
                  </div>
                </div>

                {/* WCAG 2.1 AAA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${compliance.wcag21AAA >= 80 ? 'bg-green-500' : compliance.wcag21AAA >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      WCAG 2.1 AAA
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          compliance.wcag21AAA >= 80 ? 'bg-green-500' : compliance.wcag21AAA >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${compliance.wcag21AAA}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                      {compliance.wcag21AAA}%
                    </span>
                  </div>
                </div>

                {/* Section 508 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${compliance.section508 >= 80 ? 'bg-green-500' : compliance.section508 >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Section 508
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          compliance.section508 >= 80 ? 'bg-green-500' : compliance.section508 >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${compliance.section508}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                      {compliance.section508}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {score >= 90 
              ? "🎉 Excellent! Your website has great accessibility." 
              : score >= 70 
              ? "👍 Good job! A few improvements will make it even better." 
              : "⚠️ Your website needs accessibility improvements to be inclusive."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="btn-primary">
              View Detailed Report
            </button>
            <button className="btn-secondary">
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}