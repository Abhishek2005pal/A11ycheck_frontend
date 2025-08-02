'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'a11ycheck-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only run on client side after component mounts
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme) {
      setTheme(storedTheme)
    } else {
      // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setTheme(systemTheme)
    }
    setMounted(true)
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    const body = window.document.body
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')
    
    // Add current theme class
    root.classList.add(theme)
    body.classList.add(theme)

    // Set background colors directly on body to prevent scrolling issues
    if (theme === 'dark') {
      body.style.backgroundColor = 'rgb(17 24 39)' // gray-900
      body.style.color = 'rgb(255 255 255)' // white
    } else {
      body.style.backgroundColor = 'rgb(255 255 255)' // white
      body.style.color = 'rgb(17 24 39)' // gray-900
    }

    // Save to localStorage
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey, mounted])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    )
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}