'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import API_BASE_URL from '../config/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('✅ Login successful! Redirecting...');
        setIsSuccess(true);
        
        // Store the token
        localStorage.setItem('token', data.token);
        
        // Trigger a page refresh or emit an event to update the header
        // Option 1: Refresh the page to update header state
        setTimeout(() => {
          window.location.href = '/'; // This will refresh and update header
        }, 1500);
        
        // Option 2: If you want to use router.push (but header won't update immediately)
        // setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage(`❌ ${data.error || 'Login failed'}`);
        setIsSuccess(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('❌ Server error. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Login to Your Account
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={isLoading}
              className="input"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="input"
            />
          </div>

          {/* Show Password Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={e => setShowPassword(e.target.checked)}
              disabled={isLoading}
              className="mr-2"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-600 dark:text-gray-400">
              Show password
            </label>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>

          {/* <button
            type="button"
            onClick={() => signIn('google')}
            disabled={isLoading}
            className="btn-google w-full"
          >
            Continue with Google
          </button> */}
        </form>

        {/* Message below form */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            isSuccess 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            <p className="text-sm font-medium text-center">{message}</p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}