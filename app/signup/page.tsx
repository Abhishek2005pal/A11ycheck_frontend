'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setMessage("❌ Passwords don't match");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("❌ Password must be at least 6 characters long");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      setMessage("❌ Username must be at least 3 characters long");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, email, password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('✅ Account created successfully! Redirecting to login...');
        setIsSuccess(true);
        
        // Clear form
        setUsername('');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to login page
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage(`❌ ${data.error || 'Signup failed'}`);
        setIsSuccess(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
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
          Create an Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Username */}
          <div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a username (min 3 characters)"
              required
              disabled={isLoading}
              minLength={3}
              maxLength={20}
              className="input"
            />
          </div>

          {/* Name */}
          <div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
              className="input"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Create a password (min 6 characters)"
              required
              disabled={isLoading}
              minLength={6}
              className="input"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
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
                <span>Creating account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => signIn('google')}
            disabled={isLoading}
            className="btn-google w-full"
          >
            Continue with Google
          </button>
        </form>

        {/* Message (Success or Error) */}
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
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}