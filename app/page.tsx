'use client'

import { ArrowRight, BarChart3, CheckCircle, Download, Eye, Globe, Heart, Play, Shield, Sparkles, Target, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from './components/ThemeProvider'; // Add this import

export default function HomePage() {
  const router = useRouter()
  const { theme } = useTheme() // Add this line

  const handleStartScan = () => {
    router.push('/scan')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 text-gray-900 dark:text-white transition-colors duration-500">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -left-60 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl animate-ping animation-delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400 mr-4" />
              <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 dark:from-blue-300 dark:via-cyan-300 dark:to-sky-300 bg-clip-text text-transparent animate-pulse">
                A11yCheck
              </h1>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Build a More Inclusive Web for Everyone
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your website into an accessible experience that welcomes all users. 
              Our advanced AI-powered scanner provides comprehensive WCAG compliance audits with 
              actionable insights to make your site truly inclusive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartScan}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 active:scale-95 group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span className="text-lg mr-2">Start Free Accessibility Audit</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-transparent border-2 border-blue-400/50 hover:border-blue-400 dark:border-blue-400/50 dark:hover:border-blue-400 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Watch Demo</span>
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>WCAG 2.1 compliant</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">How A11yCheck Works</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Get comprehensive accessibility insights in just three simple steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-8 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Enter Your URL</h3>
                  <p className="text-gray-600 dark:text-blue-200">Simply paste your website URL and let our advanced scanner analyze every aspect of your site's accessibility</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-8 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">AI-Powered Analysis</h3>
                  <p className="text-gray-600 dark:text-blue-200">Our intelligent system checks against WCAG 2.1 guidelines, examining color contrast, keyboard navigation, and screen reader compatibility</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-8 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Actionable Insights</h3>
                  <p className="text-gray-600 dark:text-blue-200">Receive detailed reports with prioritized fixes, code examples, and step-by-step guidance to improve accessibility</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Accessibility Features</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to make your website accessible and compliant
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Comprehensive Scoring</h3>
                <p className="text-gray-600 dark:text-blue-200">Get detailed accessibility scores based on WCAG 2.1 AA/AAA standards with clear performance metrics</p>
              </div>
              <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <Eye className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Visual Issue Detection</h3>
                <p className="text-gray-600 dark:text-blue-200">Identify color contrast issues, missing alt text, and other visual accessibility barriers with screenshots</p>
              </div>
              <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <Download className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Professional Reports</h3>
                <p className="text-gray-600 dark:text-blue-200">Export comprehensive PDF reports perfect for stakeholders, developers, and compliance documentation</p>
              </div>
              <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Team Collaboration</h3>
                <p className="text-gray-600 dark:text-blue-200">Share findings with your team, assign tasks, and track progress on accessibility improvements</p>
              </div>
              <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <Zap className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Continuous Monitoring</h3>
                <p className="text-gray-600 dark:text-blue-200">Set up automated scans to monitor accessibility improvements and catch new issues as they arise</p>
              </div>
              <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <CheckCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Legal Compliance</h3>
                <p className="text-gray-600 dark:text-blue-200">Ensure compliance with ADA, Section 508, and international accessibility laws with detailed documentation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Accessibility Matters Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Web Accessibility Matters</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Building accessible websites isn't just the right thing to do—it's smart business that opens your site to everyone
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                  <Globe className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">1.3B+</h3>
                  <p className="text-gray-600 dark:text-blue-200 font-medium">People worldwide live with disabilities</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                  <Heart className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">71%</h3>
                  <p className="text-gray-600 dark:text-blue-200 font-medium">Of users with disabilities abandon inaccessible sites</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                  <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">$13T</h3>
                  <p className="text-gray-600 dark:text-blue-200 font-medium">Annual spending power of people with disabilities</p>
                </div>
              </div>
              <div className="text-center group">
                <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-6 hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                  <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Legal</h3>
                  <p className="text-gray-600 dark:text-blue-200 font-medium">Protection against ADA lawsuits and compliance issues</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Benefits of Accessible Design</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Accessibility improvements benefit everyone, not just users with disabilities
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 dark:bg-gradient-to-br dark:from-green-800/30 dark:to-green-900/30 backdrop-blur-sm border border-gray-200 dark:border-green-700/50 rounded-3xl p-8 hover:border-green-400/50 dark:hover:border-green-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <Users className="w-12 h-12 text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Improved User Experience</h3>
                <p className="text-gray-600 dark:text-gray-200">Better navigation, clearer content structure, and enhanced usability for all users, regardless of abilities</p>
              </div>
              <div className="bg-white/80 dark:bg-gradient-to-br dark:from-purple-800/30 dark:to-purple-900/30 backdrop-blur-sm border border-gray-200 dark:border-purple-700/50 rounded-3xl p-8 hover:border-purple-400/50 dark:hover:border-purple-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <BarChart3 className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Better SEO Rankings</h3>
                <p className="text-gray-600 dark:text-gray-200">Accessible sites often rank higher in search results due to better structure and semantic markup</p>
              </div>
              <div className="bg-white/80 dark:bg-gradient-to-br dark:from-red-800/30 dark:to-red-900/30 backdrop-blur-sm border border-gray-200 dark:border-red-700/50 rounded-3xl p-8 hover:border-red-400/50 dark:hover:border-red-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <Heart className="w-12 h-12 text-red-600 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Brand Reputation</h3>
                <p className="text-gray-600 dark:text-gray-200">Demonstrate your commitment to inclusivity and social responsibility, building trust with all users</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-indigo-900/30 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-3xl p-12 shadow-2xl">
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Ready to Create an Inclusive Web Experience?</h2>
              <p className="text-xl text-gray-600 dark:text-blue-200 mb-8">
                Join thousands of developers and businesses making the web accessible for everyone. 
                Start your comprehensive accessibility audit today—completely free.
              </p>
              <button
                onClick={handleStartScan}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center mx-auto shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 active:scale-95 group mb-4"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span className="text-lg mr-2">Start Your Free Accessibility Audit</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ✨ No registration required • Get results in seconds • 100% free to start
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-gray-200 dark:border-slate-600">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-300 dark:to-cyan-300 bg-clip-text text-transparent">
                    A11yCheck
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-blue-200 mb-4">
                  Making the web accessible and inclusive for everyone, one site at a time.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Product</h4>
                <ul className="space-y-2 text-gray-600 dark:text-blue-200">
                  <li><a href="/scan" className="hover:text-blue-600 dark:hover:text-white transition-colors">Accessibility Scanner</a></li>
                  <li><a href="/dashboard" className="hover:text-blue-600 dark:hover:text-white transition-colors">Dashboard</a></li>
                  <li><a href="/reports" className="hover:text-blue-600 dark:hover:text-white transition-colors">Reports & Analytics</a></li>
                  <li><a href="/team" className="hover:text-blue-600 dark:hover:text-white transition-colors">Team Management</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Resources</h4>
                <ul className="space-y-2 text-gray-600 dark:text-blue-200">
                  <li><a href="/learn" className="hover:text-blue-600 dark:hover:text-white transition-colors">Learning Center</a></li>
                  <li><a href="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">About Accessibility</a></li>
                  <li><a href="/FAQ" className="hover:text-blue-600 dark:hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/api" className="hover:text-blue-600 dark:hover:text-white transition-colors">API Documentation</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Support</h4>
                <ul className="space-y-2 text-gray-600 dark:text-blue-200">
                  <li><a href="/help" className="hover:text-blue-600 dark:hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="/contact" className="hover:text-blue-600 dark:hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/privacy" className="hover:text-blue-600 dark:hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-blue-600 dark:hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-600 mt-8 pt-8 text-center text-gray-600 dark:text-blue-200">
              <p>&copy; 2025 A11yCheck. All rights reserved. Built with accessibility in mind.</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}