import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Clock, Calendar, X, Heart, Gift, Cake, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const Countdowns = () => {
  const [countdowns, setCountdowns] = useState([])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newCountdown, setNewCountdown] = useState({
    title: '',
    date: '',
    type: 'birthday',
    icon: '🎂'
  })

  const eventTypes = [
    { id: 'birthday', label: 'Birthday', icon: Cake, emoji: '🎂' },
    { id: 'anniversary', label: 'Anniversary', icon: Heart, emoji: '💕' },
    { id: 'holiday', label: 'Holiday', icon: Star, emoji: '🎄' },
    { id: 'romantic', label: 'Romantic', icon: Heart, emoji: '💝' },
    { id: 'gift', label: 'Gift Giving', icon: Gift, emoji: '🎁' }
  ]

  const eventEmojis = ['🎂', '💝', '🎄', '💕', '🎁', '🌸', '🌹', '⭐', '🎊', '🎉', '🏆', '💎', '🌺', '🌻', '🌷', '🌼']

  const calculateTimeLeft = (targetDate) => {
    const difference = new Date(targetDate) - new Date()
    
    if (difference > 0) {
      const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44))
      const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      
      return { months, days, hours, minutes, seconds }
    }
    
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = {}
      countdowns.forEach(countdown => {
        newTimeLeft[countdown.id] = calculateTimeLeft(countdown.date)
      })
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdowns])

  const addCountdown = (e) => {
    e.preventDefault()
    if (newCountdown.title.trim() && newCountdown.date) {
      const countdown = {
        ...newCountdown,
        id: Date.now(),
        color: getRandomColor()
      }
      setCountdowns([...countdowns, countdown])
      setNewCountdown({
        title: '',
        date: '',
        type: 'birthday',
        icon: '🎂'
      })
      setShowAddForm(false)
      toast.success('Countdown added! ⏰')
    } else {
      toast.error('Please fill in all fields')
    }
  }

  const deleteCountdown = (id) => {
    setCountdowns(countdowns.filter(countdown => countdown.id !== id))
    toast.success('Countdown removed! 🗑️')
  }

  const getRandomColor = () => {
    const colors = [
      'from-pink-500 to-red-500',
      'from-red-500 to-pink-500',
      'from-green-500 to-red-500',
      'from-purple-500 to-pink-500',
      'from-blue-500 to-purple-500',
      'from-yellow-500 to-orange-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-blue-500'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0')
  }

  const isEventToday = (date) => {
    const today = new Date()
    const eventDate = new Date(date)
    return today.toDateString() === eventDate.toDateString()
  }

  const isEventPassed = (date) => {
    return new Date(date) < new Date()
  }

  return (
    <div className="h-full bg-gradient-to-br from-red-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="vintage-goods text-4xl text-red-800 mb-2">Countdowns</h1>
          <p className="times-roman text-lg text-gray-600">
            Track time until your special events and gift-giving occasions
          </p>
        </div>

        {/* Add Countdown Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Countdown</span>
          </button>
        </div>

        {/* Countdowns Grid */}
        {countdowns.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <Clock className="mx-auto mb-4 w-12 h-12 text-red-300" />
            <p className="text-lg">No countdowns yet. Add your first event!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countdowns.map((countdown) => {
              const time = timeLeft[countdown.id] || { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
              const passed = isEventPassed(countdown.date)
              const today = isEventToday(countdown.date)
              
              return (
                <motion.div
                  key={countdown.id}
                  className={`countdown-card rounded-xl p-6 relative overflow-hidden ${
                    passed ? 'opacity-50' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${countdown.color} opacity-10`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{countdown.icon}</div>
                        <div>
                          <h3 className="vintage-goods text-xl text-gray-800">{countdown.title}</h3>
                          <p className="times-roman text-sm text-gray-600">
                            {new Date(countdown.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCountdown(countdown.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
                      </button>
                    </div>

                    {/* Status */}
                    {passed ? (
                      <div className="text-center py-4">
                        <div className="text-2xl mb-2">🎉</div>
                        <p className="vintage-goods text-lg text-gray-800">Event has passed!</p>
                      </div>
                    ) : today ? (
                      <div className="text-center py-4">
                        <div className="text-2xl mb-2">🎊</div>
                        <p className="vintage-goods text-lg text-gray-800">It's today!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Time Units */}
                        <div className="grid grid-cols-5 gap-2">
                          <div className="text-center">
                            <div className="bg-white bg-opacity-20 rounded-lg p-2 mb-1">
                              <div className="vintage-goods text-lg text-white font-bold">
                                {formatNumber(time.months)}
                              </div>
                            </div>
                            <div className="times-roman text-xs text-white">Months</div>
                          </div>
                          <div className="text-center">
                            <div className="bg-white bg-opacity-20 rounded-lg p-2 mb-1">
                              <div className="vintage-goods text-lg text-white font-bold">
                                {formatNumber(time.days)}
                              </div>
                            </div>
                            <div className="times-roman text-xs text-white">Days</div>
                          </div>
                          <div className="text-center">
                            <div className="bg-white bg-opacity-20 rounded-lg p-2 mb-1">
                              <div className="vintage-goods text-lg text-white font-bold">
                                {formatNumber(time.hours)}
                              </div>
                            </div>
                            <div className="times-roman text-xs text-white">Hours</div>
                          </div>
                          <div className="text-center">
                            <div className="bg-white bg-opacity-20 rounded-lg p-2 mb-1">
                              <div className="vintage-goods text-lg text-white font-bold">
                                {formatNumber(time.minutes)}
                              </div>
                            </div>
                            <div className="times-roman text-xs text-white">Minutes</div>
                          </div>
                          <div className="text-center">
                            <div className="bg-white bg-opacity-20 rounded-lg p-2 mb-1">
                              <div className="vintage-goods text-lg text-white font-bold">
                                {formatNumber(time.seconds)}
                              </div>
                            </div>
                            <div className="times-roman text-xs text-white">Seconds</div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${Math.min(100, (time.days / 365) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Add Countdown Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="vintage-goods text-2xl text-gray-800 mb-6 text-center">
                  Add New Countdown
                </h2>

                <form onSubmit={addCountdown} className="space-y-4">
                  <div>
                    <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={newCountdown.title}
                      onChange={(e) => setNewCountdown({...newCountdown, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Mom's Birthday"
                      required
                    />
                  </div>

                  <div>
                    <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                      Event Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newCountdown.date}
                      onChange={(e) => setNewCountdown({...newCountdown, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      value={newCountdown.type}
                      onChange={(e) => setNewCountdown({...newCountdown, type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {eventTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                      Choose Emoji
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {eventEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setNewCountdown({...newCountdown, icon: emoji})}
                          className={`text-2xl p-2 rounded-lg transition-colors ${
                            newCountdown.icon === emoji ? 'bg-red-100 border-2 border-red-500' : 'hover:bg-gray-100'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200"
                    >
                      Add Countdown
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Countdowns 