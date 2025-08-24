import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Users, 
  Archive, 
  CheckSquare, 
  Mail, 
  Palette, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Heart,
  User,
  Settings,
  LogOut,
  Info,
  FileText,
  Github,
  Mail as MailIcon,
  BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = ({ sidebarCollapsed, setSidebarCollapsed, onLogout }) => {
  const location = useLocation()
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const navItems = [
    { path: '/home', icon: Home, label: 'Home', color: 'text-red-100' },
    { path: '/profiles', icon: Users, label: 'Profiles', color: 'text-red-100' },
    { path: '/memory-vault', icon: Archive, label: 'Memory Vault', color: 'text-red-100' },
    { path: '/todo', icon: CheckSquare, label: 'To Do', color: 'text-red-100' },
    { path: '/letters', icon: Mail, label: 'Letters', color: 'text-red-100' },
    { path: '/design', icon: Palette, label: 'Design', color: 'text-red-100' },
    { path: '/countdowns', icon: Clock, label: 'Countdowns', color: 'text-red-100' }
  ]

  const handleLogout = () => {
    toast.success('Logged out successfully! 👋')
    onLogout()
  }

  const settingsItems = [
    { icon: Info, label: 'About', action: () => setShowAbout(true) },
    { icon: FileText, label: 'Privacy Policy', action: () => setShowPrivacy(true) },
    { icon: MailIcon, label: 'Contact Support', action: () => window.open('mailto:kanvitaushal@gmail.com', '_blank') },
    { icon: BarChart3, label: 'Analytics', action: () => window.open('/analytics', '_blank') },
    { icon: Github, label: 'GitHub', action: () => window.open('https://github.com', '_blank') }
  ]

  return (
    <motion.div 
      className={`sidebar ${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out flex flex-col`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-red-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-800" />
              </div>
              <span className="vintage-goods text-white text-lg">Heartboard</span>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-full hover:bg-red-700 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-white" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-tab flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive ? 'active' : 'hover:bg-red-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.color}`} />
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 times-roman text-white font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="flex-shrink-0 p-4 border-t border-red-700">
        {/* User Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            {user.avatar?.url ? (
              <img 
                src={user.avatar.url} 
                alt={user.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-red-800" />
            )}
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <p className="times-roman text-white font-medium truncate">
                {user.name || 'Demo User'}
              </p>
              <p className="times-roman text-xs text-red-200 truncate">
                {user.email || 'demo@heartboard.com'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-700 ${
            showSettings ? 'bg-red-700' : ''
          }`}
        >
          <Settings className="w-5 h-5 text-red-100" />
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 times-roman text-white font-medium"
            >
              Settings
            </motion.span>
          )}
        </button>

        {/* Settings Menu */}
        <AnimatePresence>
          {showSettings && !sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-red-800 rounded-lg overflow-hidden"
            >
              <div className="p-2 space-y-1">
                {settingsItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={index}
                      onClick={item.action}
                      className="w-full flex items-center px-3 py-2 rounded-md text-sm text-red-100 hover:bg-red-700 transition-colors"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-700 mt-3"
        >
          <LogOut className="w-5 h-5 text-red-100" />
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 times-roman text-white font-medium"
            >
              Logout
            </motion.span>
          )}
        </button>
        {/* Made with love by Tanvi Kaushal and copyright */}
        {!sidebarCollapsed && (
          <div className="mt-8 text-xs text-red-200 text-left select-none">
            <span>Made with <span className="text-red-400">♥</span> by Tanvi Kaushal</span>
            <br />
            <span className="block mt-2">© 2025 Heartboard</span>
          </div>
        )}
      </div>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAbout(false)}>
            <motion.div className="bg-white rounded-2xl p-8 max-w-md w-full" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <h2 className="vintage-goods text-2xl text-gray-800 mb-4">About Heartboard</h2>
              <pre className="times-roman text-gray-700 mb-4 whitespace-pre-line break-words" style={{ fontFamily: 'inherit', background: 'none', border: 'none', padding: 0 }}>
Heartboard is more than an app—it's a love letter to the art of sentimental gift giving.

I made this because I believe gifts should feel like memories.
Not expensive, just meaningful.
Not random, but noticed.
The candy they love. The moment you saved. The playlist you made. The late-night surprise.

Heartboard is for those who plan birthdays like missions, cry over handwritten notes, and remember the little things people forget to say.

This is for my friends, who I love with my whole heart—
the ones who made ordinary days unforgettable, who taught me that feelings deserve to be celebrated.
Every part of Heartboard carries pieces of them.

If you've ever made a Pinterest board for a friend, written a 12AM letter, or planned a gift like it's a poem—
this is your space.

Welcome to Heartboard.
Built with love, for those who feel too much and wrap it in washi tape.

– Tanvi K
              </pre>
              <button onClick={() => setShowAbout(false)} className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPrivacy(false)}>
            <motion.div className="bg-white rounded-2xl p-8 max-w-md w-full" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <h2 className="vintage-goods text-2xl text-gray-800 mb-4">Privacy Policy</h2>
              <p className="times-roman text-gray-700 mb-4">Your privacy is important to us. Heartboard does not share your data with third parties. For questions, contact <a href="mailto:kanvitaushal@gmail.com" className="text-blue-600 underline">kanvitaushal@gmail.com</a>.</p>
              <button onClick={() => setShowPrivacy(false)} className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Dashboard 