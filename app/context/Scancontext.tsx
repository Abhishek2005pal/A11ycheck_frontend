import React, { createContext, ReactNode, useContext, useState } from 'react'

interface ScanIssue {
  id: number
  type: string
  description: string
  severity: 'error' | 'warning' | 'info'
  selector?: string
}

interface ScanResult {
  url: string
  score: number
  issues: ScanIssue[]
  timestamp: string
  deviceType: 'desktop' | 'mobile'
  scanType: 'quick' | 'full'
}

interface ScanContextType {
  scanResults: ScanResult[]
  addScanResult: (result: Omit<ScanResult, 'timestamp'>) => void
  getScanStats: () => {
    totalScans: number
    totalIssues: number
    averageScore: number
    pagesMonitored: number
  }
}

const ScanContext = createContext<ScanContextType | undefined>(undefined)

export const useScanContext = () => {
  const context = useContext(ScanContext)
  if (context === undefined) {
    throw new Error('useScanContext must be used within a ScanProvider')
  }
  return context
}

export const ScanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scanResults, setScanResults] = useState<ScanResult[]>([])

  const addScanResult = (result: Omit<ScanResult, 'timestamp'>) => {
    const newResult: ScanResult = {
      ...result,
      timestamp: new Date().toISOString()
    }
    setScanResults(prev => [newResult, ...prev])
  }

  const getScanStats = () => {
    const totalScans = scanResults.length
    const totalIssues = scanResults.reduce((sum, scan) => sum + scan.issues.length, 0)
    const averageScore = totalScans > 0 ? 
      Math.round(scanResults.reduce((sum, scan) => sum + scan.score, 0) / totalScans) : 0
    const pagesMonitored = new Set(scanResults.map(scan => scan.url)).size

    return {
      totalScans,
      totalIssues,
      averageScore,
      pagesMonitored
    }
  }

  return (
    <ScanContext.Provider value={{ scanResults, addScanResult, getScanStats }}>
      {children}
    </ScanContext.Provider>
  )
}