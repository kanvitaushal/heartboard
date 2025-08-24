import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, Heart } from 'lucide-react'
import { authAPI, healthCheck } from '../services/api'
import { trackLogin, trackRegister } from '../services/analytics'
import toast from 'react-hot-toast'

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState('checking')

  // Check server health on component mount
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        await healthCheck()
        setServerStatus('connected')
      } catch (error) {
        console.error('Server health check failed:', error)
        setServerStatus('disconnected')
      }
    }
    
    checkServerHealth()
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let response
      
      if (isLogin) {
        // Login
        response = await authAPI.login({
          email: formData.email,
          password: formData.password
        })
      } else {
        // Register
        response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })
      }

      if (response.data.success) {
        // Save token and user data
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data))
        
        // Track analytics
        if (isLogin) {
          await trackLogin(response.data.data, false)
        } else {
          await trackRegister(response.data.data)
        }
        
        toast.success(isLogin ? 'Welcome back! ❤️' : 'Account created successfully! 🎉')
        onAuthSuccess(response.data.data)
      }
    } catch (error) {
      console.error('Auth error:', error)
      let message = 'Authentication failed'
      
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.code === 'NETWORK_ERROR') {
        message = 'Network error - please check your connection'
      } else if (error.response?.status === 0) {
        message = 'Cannot connect to server - please try again later'
      }
      
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ name: '', email: '', password: '', phone: '' })
    setShowPassword(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="vintage-goods text-3xl text-red-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Join Heartboard'}
            </h1>
            <p className="times-roman text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your account to start gifting'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="times-roman text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 times-roman text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Server Status */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                serverStatus === 'connected' ? 'bg-green-500' : 
                serverStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-xs text-gray-500">
                {serverStatus === 'connected' ? 'Server Connected' : 
                 serverStatus === 'disconnected' ? 'Server Disconnected' : 'Checking Server...'}
              </span>
            </div>
          </div>

          {/* Demo Login */}
          <div className="mt-6">
            <button
              onClick={async () => {
                // Demo login for testing
                const demoUser = {
                  _id: 'demo123',
                  name: 'Demo User',
                  email: 'demo@heartboard.com',
                  avatar: { url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg' },
                  role: 'user',
                  isVerified: true,
                  preferences: { theme: 'dark-red', notifications: { email: true, push: true } }
                }
                localStorage.setItem('token', 'demo-token')
                localStorage.setItem('user', JSON.stringify(demoUser))
                
                // Track demo login
                await trackLogin(demoUser, true)
                
                toast.success('Demo mode activated! 🎉')
                // Call the success handler to update authentication state
                onAuthSuccess(demoUser)
              }}
              className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Try Demo Mode
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Auth 