import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Calendar, BarChart3, RefreshCw } from 'lucide-react'
import { analyticsAPI } from '../services/analytics'
import toast from 'react-hot-toast'

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await analyticsAPI.getStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="vintage-goods text-xl text-red-800">Loading Analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="vintage-goods text-4xl text-red-800 mb-2">Heartboard Analytics</h1>
          <p className="times-roman text-lg text-red-700">Track your app's growth and user engagement</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-red-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Logins</p>
                <p className="text-3xl font-bold text-red-800">{stats?.totalLogins || 0}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Users className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-red-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Demo Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.demoLogins || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Trial logins</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-red-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Registered Users</p>
                <p className="text-3xl font-bold text-green-600">{stats?.registeredLogins || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Full accounts</p>
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-red-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="vintage-goods text-2xl text-red-800">Summary</h2>
            <button
              onClick={fetchStats}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">User Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Demo Users</span>
                  <span className="font-medium text-blue-600">
                    {stats?.demoLogins || 0} ({stats?.totalLogins ? Math.round((stats.demoLogins / stats.totalLogins) * 100) : 0}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Registered Users</span>
                  <span className="font-medium text-green-600">
                    {stats?.registeredLogins || 0} ({stats?.totalLogins ? Math.round((stats.registeredLogins / stats.totalLogins) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Growth Insights</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Total logins tracked: <span className="font-medium text-red-800">{stats?.totalLogins || 0}</span></p>
                <p>• Demo to registered conversion: <span className="font-medium text-green-600">
                  {stats?.demoLogins && stats?.registeredLogins ? Math.round((stats.registeredLogins / (stats.demoLogins + stats.registeredLogins)) * 100) : 0}%
                </span></p>
                <p>• Period: <span className="font-medium text-gray-800">Last 30 days</span></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>Analytics data is collected anonymously and respects user privacy</p>
          <p className="mt-1">Made with ❤️ by Tanvi Kaushal</p>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
