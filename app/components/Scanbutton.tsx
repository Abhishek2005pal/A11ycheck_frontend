'use client'

import { Play, RotateCcw, Square, Zap } from 'lucide-react'
import { useState } from 'react'

interface ScanButtonProps {
  onScan: () => void
  onStop?: () => void
  onReset?: () => void
  isScanning?: boolean
  hasResults?: boolean
  progress?: number
  disabled?: boolean
  scanStage?: string
}

export default function ScanButton({ 
  onScan, 
  onStop, 
  onReset,
  isScanning = false, 
  hasResults = false, 
  progress = 0,
  disabled = false,
  scanStage = 'Initializing...'
}: ScanButtonProps) {
  const [animationKey, setAnimationKey] = useState(0)

  const handleScan = () => {
    setAnimationKey(prev => prev + 1)
    onScan()
  }

  const getScanStageInfo = (stage: string) => {
    const stages = {
      'Initializing...': { icon: '🚀', description: 'Preparing to scan' },
      'Loading page...': { icon: '📄', description: 'Fetching website content' },
      'Analyzing structure...': { icon: '🏗️', description: 'Examining HTML structure' },
      'Checking WCAG compliance...': { icon: '✅', description: 'Running accessibility tests' },
      'Testing color contrast...': { icon: '🎨', description: 'Analyzing color accessibility' },
      'Validating forms...': { icon: '📝', description: 'Checking form accessibility' },
      'Scanning images...': { icon: '🖼️', description: 'Verifying alt text and images' },
      'Testing keyboard navigation...': { icon: '⌨️', description: 'Checking keyboard accessibility' },
      'Finalizing results...': { icon: '📊', description: 'Compiling accessibility report' }
    }
    
    return stages[stage as keyof typeof stages] || { icon: '⚡', description: 'Processing...' }
  }

  const stageInfo = getScanStageInfo(scanStage)

  if (isScanning) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        {/* Progress card */}
        <div className="card p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-2xl animate-bounce" key={`${scanStage}-${animationKey}`}>
                {stageInfo.icon}
              </div>
              <div className="loading-spinner w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Scanning in Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stageInfo.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {scanStage}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar h-3">
                <div 
                  className="progress-fill h-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stop button */}
            {onStop && (
              <button
                onClick={onStop}
                className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                <Square className="w-4 h-4" />
                <span>Stop Scan</span>
              </button>
            )}
          </div>
        </div>

        {/* Scanning tips */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>💡 Tip: Larger websites may take longer to analyze completely</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
      {/* Main scan button */}
      <button
        onClick={handleScan}
        disabled={disabled}
        className={`
          flex items-center justify-center space-x-3 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform
          ${disabled 
            ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
            : 'btn-primary hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          }
        `}
      >
        <Play className="w-5 h-5" />
        <span>
          {hasResults ? 'Scan Again' : 'Start Accessibility Scan'}
        </span>
        <Zap className="w-5 h-5" />
      </button>

      {/* Reset button (shown when there are results) */}
      {hasResults && onReset && (
        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-2 px-4 py-2 btn-secondary text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      )}
    </div>
  )
}