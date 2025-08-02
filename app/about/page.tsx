'use client'
import { Award, Eye, Globe, Heart, Shield, Target, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const AboutPage = () => {
  const [isDark, setIsDark] = useState(false);

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Check system preference
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "AI-Powered Scanning",
      description: "Advanced machine learning algorithms detect complex accessibility patterns and edge cases that traditional scanners miss."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Monitoring",
      description: "Continuous accessibility monitoring with instant alerts when new issues are introduced to your live website."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Prioritization",
      description: "Issues ranked by impact severity, user affect, and legal risk to help you focus on what matters most."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Multi-Standard Support",
      description: "Complete coverage for WCAG 2.1/2.2, Section 508, EN 301 549, and emerging WCAG 3.0 guidelines."
    }
  ];

  const stats = [
    { number: "2.5M+", label: "Pages Scanned Daily" },
    { number: "150K+", label: "Issues Resolved" },
    { number: "99.7%", label: "Accuracy Rate" },
    { number: "10K+", label: "Active Users" }
  ];

  const team = [
    {
      role: "Chief Accessibility Officer",
      name: "Dr. Sarah Chen",
      description: "15+ years leading accessibility initiatives at Fortune 500 companies. Certified IAAP professional.",
      expertise: "WCAG Expert • Legal Compliance • Strategy"
    },
    {
      role: "Lead UX Researcher",
      name: "Marcus Williams", 
      description: "Specializes in inclusive design research and usability testing with disabled users.",
      expertise: "User Research • Inclusive Design • Testing"
    },
    {
      role: "Senior Accessibility Engineer",
      name: "Priya Patel",
      description: "Former assistive technology developer with deep technical expertise in ARIA and screen readers.",
      expertise: "Technical Implementation • ARIA • AT Compatibility"
    },
    {
      role: "AI/ML Accessibility Specialist",
      name: "Dr. James Rodriguez",
      description: "PhD in Computer Science, pioneering AI approaches to automated accessibility testing.",
      expertise: "Machine Learning • Automated Testing • Innovation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Theme Toggle Button */}
      {/* <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div> */}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/20 dark:to-purple-400/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full transition-all duration-300">
                <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Making the Web
              <span className="block text-blue-600 dark:text-blue-400">Accessible for All</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 transition-colors duration-300">
              A11yCheck is the industry-leading accessibility scanner trusted by over 10,000+ developers worldwide. 
              We automatically detect, analyze, and provide actionable solutions for WCAG compliance issues, 
              helping you build inclusive digital experiences that reach every user.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border dark:border-slate-700 transition-all duration-300">
                <Globe className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">WCAG 2.1 AA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border dark:border-slate-700 transition-all duration-300">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Built with Care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
                At A11yCheck, we envision a digital world where accessibility isn't an afterthought—it's built in from day one. 
                Our mission is to democratize web accessibility by providing developers, designers, and organizations with 
                enterprise-grade tools that make WCAG compliance achievable, measurable, and maintainable.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
                Founded by accessibility experts who understand the real challenges of inclusive design, we've built the most 
                comprehensive scanning engine that goes beyond basic compliance checking. We provide contextual guidance, 
                prioritized fix recommendations, and continuous monitoring to ensure your digital products remain accessible as they evolve.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-300">{stat.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl p-8 text-white transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">The Impact of Inclusive Design</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Users className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>1.3 billion people globally experience significant disability (WHO, 2023)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Legal requirements in 180+ countries including ADA, AODA, EN 301 549</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Target className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>71% increase in conversion rates with accessible design practices</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>$13 trillion annual spending power of the disability community</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Advanced Accessibility Intelligence</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              Our next-generation scanning engine combines automated testing, AI analysis, and expert knowledge 
              to deliver the most comprehensive accessibility insights available in the market.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border dark:border-slate-700 hover:scale-105">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg inline-block mb-4 transition-colors duration-300">
                  <div className="text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-slate-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Our Three-Pillar Approach</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              We combine automated precision, human expertise, and continuous learning to deliver 
              accessibility insights that truly drive meaningful change.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border dark:border-slate-700 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Automated Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our AI-powered engine scans at lightning speed, processing millions of elements 
                to identify accessibility barriers across your entire digital ecosystem.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• 400+ automated test rules</li>
                <li>• Machine learning pattern recognition</li>
                <li>• Cross-browser compatibility testing</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border dark:border-slate-700 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Human Validation</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our certified accessibility experts review complex scenarios and provide 
                contextual guidance that only human experience can deliver.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Manual expert review</li>
                <li>• Real user testing with disabled users</li>
                <li>• Contextual recommendations</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border dark:border-slate-700 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Continuous Learning</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We constantly evolve our platform based on emerging standards, user feedback, 
                and the latest research in assistive technology.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Regular standard updates</li>
                <li>• Community-driven improvements</li>
                <li>• Research collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Scan Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">What We Scan For</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              Our comprehensive scanning covers all major accessibility guidelines and best practices.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border dark:border-green-700/50 transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Visual & Cognitive</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <li>• Color contrast & color blindness simulation</li>
                <li>• Typography readability & dyslexia-friendly fonts</li>
                <li>• Image alternative text quality assessment</li>
                <li>• Motion sensitivity & animation analysis</li>
                <li>• Focus management & visual indicators</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border dark:border-blue-700/50 transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Motor & Navigation</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <li>• Keyboard navigation flow & tab sequences</li>
                <li>• Touch target size & spacing validation</li>
                <li>• Voice control compatibility testing</li>
                <li>• Switch navigation support verification</li>
                <li>• Gesture alternative path checking</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border dark:border-purple-700/50 transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Assistive Technology</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <li>• Screen reader compatibility (JAWS, NVDA, VoiceOver)</li>
                <li>• ARIA implementation & semantic structure</li>
                <li>• Magnification software compatibility</li>
                <li>• Voice recognition software support</li>
                <li>• Braille display optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Meet Our Accessibility Experts</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              Our diverse team of certified accessibility professionals, researchers, and engineers brings decades 
              of combined experience from leading tech companies, research institutions, and advocacy organizations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm border dark:border-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 text-white font-bold text-lg">
                  {member.name ? member.name.split(' ').map(n => n[0]).join('') : <Users className="w-8 h-8" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{member.role}</h3>
                {member.name && <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{member.name}</p>}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 transition-colors duration-300">{member.description}</p>
                {member.expertise && <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 rounded-full px-3 py-1">{member.expertise}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Transform Your Digital Accessibility Today
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-50 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations using A11yCheck to create inclusive digital experiences. 
            Start with a free scan and see how accessible your website really is.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/scan'}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Start Free Scan
            </button>
            {/* <button 
              onClick={() => window.open('https://docs.a11ycheck.com', '_blank')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
            >
              View Documentation
            </button> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">A11yCheck</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
                Making the web accessible for everyone through comprehensive 
                accessibility scanning and actionable insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Product</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="/scan" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Free Scanner</a></li>
                <li><a href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Pricing</a></li>
                <li><a href="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Features</a></li>
                <li><a href="/integrations" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Resources</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="https://docs.a11ycheck.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Documentation</a></li>
                <li><a href="https://docs.a11ycheck.com/api" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">API Reference</a></li>
                <li><a href="https://docs.a11ycheck.com/guides" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Best Practices</a></li>
                <li><a href="/support" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Support Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Company</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">About Us</a></li>
                <li><a href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Contact</a></li>
                <li><a href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p>&copy; 2025 A11yCheck. All rights reserved. Building a more accessible web, one scan at a time.</p>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
                <a href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Terms of Service</a>
                <a href="https://docs.a11ycheck.com/wcag" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">WCAG Guidelines</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;