'use client'

import { GraduationCap, Home, Info, LayoutDashboard, LogIn, LogOut, Menu, Moon, Shield, Sun, User as UserIcon, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

interface User {
  id: string
  name?: string
  email: string
  bio?: string
  profilePhoto?: string | null
  createdAt?: string
}

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showAuthDropdown, setShowAuthDropdown] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoggedIn(false)
        setUser(null)
        setIsLoading(false)
        return
      }

      const res = await fetch('http://localhost:4000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        const userData: User = await res.json()
        setUser(userData)
        setIsLoggedIn(true)
      } else {
        // Token is invalid
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setUser(null)
    setShowAuthDropdown(false)
    router.push('/')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const getInitials = (email: string): string => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  const getUserDisplayName = (user: User | null): string => {
    if (!user) return 'User'
    return user.name || user.email?.split('@')[0] || 'User'
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    // { name: 'Team', href: '/team', icon: Users },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Learn', href: '/learn', icon: GraduationCap },
  ];

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 transition-theme">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                A11y<span className="text-blue-600">Check</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Web Accessibility Scanner
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              )
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200 flex-shrink-0"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              )}
            </button>

            {/* Auth Section */}
            {!isLoading && (
              <div className="relative hidden sm:block flex-shrink-0">
                {isLoggedIn && user ? (
                  // Logged in user profile
                  <button
                    onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 min-w-0"
                  >
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-600 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {getInitials(user.email)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block truncate max-w-20">
                      {getUserDisplayName(user)}
                    </span>
                  </button>
                ) : (
                  // Not logged in
                  <button
                    onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden lg:block">Account</span>
                  </button>
                )}

                {/* Dropdown Menu */}
                {showAuthDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-10">
                    {isLoggedIn && user ? (
                      // Logged in dropdown
                      <>
                        <a
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Profile</span>
                        </a>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      // Not logged in dropdown
                      <>
                        <a
                          href="/login"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Login</span>
                        </a>
                        <a
                          href="/signup"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => setShowAuthDropdown(false)}
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Sign Up</span>
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* CTA Button - Moved after auth section */}
            <button 
              onClick={() => router.push('/scan')}
              className="hidden sm:inline-flex btn-primary text-sm px-3 py-1.5 flex-shrink-0 whitespace-nowrap"
            >
              Start Scan
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200 flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-slate-700">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                )
              })}
              
              {/* Mobile Auth Section */}
              {!isLoading && (
                <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-3">
                  {isLoggedIn && user ? (
                    // Logged in mobile menu
                    <>
                      <div className="flex items-center space-x-3 py-2 px-3 mb-2">
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-600"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {getInitials(user.email)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {getUserDisplayName(user)}
                        </span>
                      </div>
                      <a
                        href="/profile"
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserIcon className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </a>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    // Not logged in mobile menu
                    <>
                      <a
                        href="/login"
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LogIn className="w-5 h-5" />
                        <span className="font-medium">Login</span>
                      </a>
                      <a
                        href="/signup"
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserPlus className="w-5 h-5" />
                        <span className="font-medium">Sign Up</span>
                      </a>
                    </>
                  )}
                </div>
              )}
              
              <button 
                onClick={() => router.push('/scan')}
                className="btn-primary mt-4"
              >
                Start Scan
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showAuthDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowAuthDropdown(false)}
        />
      )}

      {/* Progress indicator for active scans */}
      <div className="h-1 bg-gray-200 dark:bg-slate-700">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-0 transition-all duration-300 ease-out"></div>
      </div>
    </header>
  )
}