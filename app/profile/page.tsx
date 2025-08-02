'use client'

import { Camera, Mail, Save, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Define interfaces for type safety
interface User {
  id: string
  name?: string
  email: string
  bio?: string
  profilePhoto?: string | null
  createdAt?: string
}

interface FormData {
  name: string
  email: string
  bio: string
  profilePhoto: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    bio: '',
    profilePhoto: null
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('No token found, redirecting to login')
        router.push('/login')
        return
      }

      console.log('Checking auth with token:', token.substring(0, 20) + '...')
      
      const res = await fetch('http://localhost:4000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Auth response status:', res.status)
      
      if (res.ok) {
        const userData: User = await res.json()
        console.log('User data received:', userData)
        setUser(userData)
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          profilePhoto: userData.profilePhoto || null
        })
        console.log('Form data set:', {
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          profilePhoto: userData.profilePhoto || null
        })
      } else {
        const errorData = await res.json()
        console.error('Auth error:', errorData)
        localStorage.removeItem('token')
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ File size must be less than 5MB')
        setIsSuccess(false)
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select a valid image file')
        setIsSuccess(false)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          setFormData(prev => ({
            ...prev,
            profilePhoto: result
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage('❌ Please login again')
        setIsSuccess(false)
        router.push('/login')
        return
      }

      const res = await fetch('http://localhost:4000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          profilePhoto: formData.profilePhoto
        })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('✅ Profile updated successfully')
        setIsSuccess(true)
        setUser(data.user)
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage('')
        }, 3000)
      } else {
        setMessage(`❌ ${data.error || 'Update failed'}`)
        setIsSuccess(false)
      }
    } catch (error) {
      console.error('Update error:', error)
      setMessage('❌ Server error. Please try again.')
      setIsSuccess(false)
    } finally {
      setIsUpdating(false)
    }
  }

  const getInitials = (email: string): string => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  const getUserDisplayName = (user: User | null): string => {
    if (!user) return 'User'
    return user.name || user.email?.split('@')[0] || 'User'
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show error state if no user data
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Unable to load your profile. Please try logging in again.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and profile information
            </p>
          </div>

          {/* Debug Info - Remove in production */}
          <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Debug: User ID: {user.id}, Email: {user.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-600"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center border-4 border-blue-600">
                    <span className="text-white font-bold text-2xl">
                      {getInitials(formData.email)}
                    </span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click the camera icon to upload a new photo
              </p>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600"
                disabled
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg ${
              isSuccess
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Account Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Member since</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">User ID</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.id || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Display Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {getUserDisplayName(user)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Account Status</p>
                <p className="font-medium text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}