'use client'

import { AlertCircle, CheckCircle, Globe } from 'lucide-react'
import { useState } from 'react'

interface URLInputProps {
  onUrlSubmit: (url: string) => void
  isLoading?: boolean
  value?: string
}

export default function URLInput({ onUrlSubmit, isLoading = false, value = '' }: URLInputProps) {
  const [url, setUrl] = useState(value)
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

  const validateUrl = (inputUrl: string) => {
    if (!inputUrl.trim()) {
      setError('')
      setIsValid(false)
      return false
    }

    try {
      // Add protocol if missing
      const urlToValidate = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`
      const urlObj = new URL(urlToValidate)
      
      // Check if it's a valid domain
      if (!urlObj.hostname.includes('.')) {
        setError('Please enter a valid domain name')
        setIsValid(false)
        return false
      }

      setError('')
      setIsValid(true)
      return true
    } catch {
      setError('Please enter a valid URL')
      setIsValid(false)
      return false
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    validateUrl(newUrl)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setError('Please enter a URL to scan')
      return
    }

    if (validateUrl(url)) {
      const urlToSubmit = url.startsWith('http') ? url : `https://${url}`
      onUrlSubmit(urlToSubmit)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && isValid) {
      handleSubmit(e as any)
    }
  }

  const exampleUrls = [
    'github.com',
    'stackoverflow.com',
    'mozilla.org',
    'w3.org'
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          
          <input
            type="text"
            value={url}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter website URL (e.g., example.com or https://example.com)"
            className={`
              input-field pl-10 pr-12 py-4 text-lg
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${isValid && url ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
            `}
            disabled={isLoading}
            aria-describedby={error ? 'url-error' : undefined}
            aria-invalid={!!error}
          />
          
          {/* Validation icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {url && (
              <>
                {error && (
                  <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                )}
                {isValid && !error && (
                  <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                )}
              </>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div id="url-error" className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm" role="alert">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || !isValid || !url.trim()}
          className={`
            w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200
            ${isLoading || !isValid || !url.trim()
              ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'btn-primary hover:shadow-lg transform hover:-translate-y-0.5'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="loading-spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Analyzing Website...</span>
            </div>
          ) : (
            'Start Accessibility Scan'
          )}
        </button>
      </form>

      {/* Example URLs */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Try these example websites:
        </p>
        <div className="flex flex-wrap gap-2">
          {exampleUrls.map((exampleUrl) => (
            <button
              key={exampleUrl}
              onClick={() => {
                setUrl(exampleUrl)
                validateUrl(exampleUrl)
              }}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exampleUrl}
            </button>
          ))}
        </div>
      </div>

      {/* Help text */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">What we'll analyze:</p>
            <ul className="space-y-1 text-blue-700 dark:text-blue-400">
              <li>• WCAG 2.1 compliance (AA level)</li>
              <li>• Color contrast ratios</li>
              <li>• Keyboard navigation</li>
              <li>• Screen reader compatibility</li>
              <li>• Form accessibility</li>
              <li>• Image alt text</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}