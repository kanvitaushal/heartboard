import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Calendar, DollarSign, Link as LinkIcon, FileText } from 'lucide-react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Profiles from './components/Profiles'
import MemoryVault from './components/MemoryVault'
import TodoList from './components/TodoList'
import Letters from './components/Letters'
import Design from './components/Design'
import Countdowns from './components/Countdowns'
import './App.css'
import { healthCheck } from './services/api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    
    setLoading(false)
  }, [])

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    // Force a clean state reset
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="vintage-goods text-xl text-red-800">Loading Heartboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/login" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
        <Route path="*" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
      </Routes>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Dashboard 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />
      <motion.div 
        className="flex-1 flex flex-col overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage user={user} />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/memory-vault" element={<MemoryVault />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/letters" element={<Letters />} />
          <Route path="/design" element={<Design />} />
          <Route path="/countdowns" element={<Countdowns />} />
          <Route path="/login" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </motion.div>
    </div>
  )
}

// HomePage component for the main dashboard
function HomePage({ user }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [loadingDemo, setLoadingDemo] = useState(true)

  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    status: 'pending',
    gifts: []
  })

  const [newGift, setNewGift] = useState({
    name: '',
    link: '',
    price: '',
    note: '',
    done: false
  })

  const [showEditEvent, setShowEditEvent] = useState(false)
  const [editEventData, setEditEventData] = useState(null)

  const [showVaultPicker, setShowVaultPicker] = useState(false)
  const [vaultPickerTarget, setVaultPickerTarget] = useState(null)

  const categories = ['all', 'completed', 'pending', 'shared']
  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.status === selectedCategory)

  const playEnvelopeSound = () => {
    // In a real app, you'd play an actual sound file
    console.log('Envelope opening sound!')
  }

  const openEvent = (event) => {
    playEnvelopeSound()
    setSelectedEvent(event)
  }

  const toggleGiftStatus = (eventId, giftId) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          gifts: event.gifts.map(gift => 
            gift.id === giftId ? { ...gift, done: !gift.done } : gift
          )
        }
      }
      return event
    }))
  }

  const addEvent = (e) => {
    e.preventDefault()
    if (newEvent.name.trim() && newEvent.date) {
      const event = {
        ...newEvent,
        id: Date.now(),
        gifts: newEvent.gifts
      }
      setEvents([...events, event])
      setNewEvent({
        name: '',
        date: '',
        status: 'pending',
        gifts: []
      })
      setShowAddEvent(false)
    }
  }

  const addGiftToEvent = () => {
    if (newGift.name.trim()) {
      const gift = {
        ...newGift,
        id: Date.now(),
        price: parseFloat(newGift.price) || 0
      }
      setNewEvent({
        ...newEvent,
        gifts: [...newEvent.gifts, gift]
      })
      setNewGift({
        name: '',
        link: '',
        price: '',
        note: '',
        done: false
      })
    }
  }

  const removeGift = (giftId) => {
    setNewEvent({
      ...newEvent,
      gifts: newEvent.gifts.filter(gift => gift.id !== giftId)
    })
  }

  const deleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId))
      setSelectedEvent(null)
    }
  }

  const openEditEvent = (event) => {
    setEditEventData({ ...event, gifts: [...event.gifts] })
    setShowEditEvent(true)
  }

  const handleEditEventChange = (field, value) => {
    setEditEventData({ ...editEventData, [field]: value })
  }

  const handleEditGiftChange = (giftId, field, value) => {
    setEditEventData({
      ...editEventData,
      gifts: editEventData.gifts.map(gift =>
        gift.id === giftId ? { ...gift, [field]: value } : gift
      )
    })
  }

  const removeEditGift = (giftId) => {
    setEditEventData({
      ...editEventData,
      gifts: editEventData.gifts.filter(gift => gift.id !== giftId)
    })
  }

  const [editNewGift, setEditNewGift] = useState({ name: '', link: '', price: '', note: '', done: false })
  const addEditGift = () => {
    if (editNewGift.name.trim()) {
      setEditEventData({
        ...editEventData,
        gifts: [...editEventData.gifts, { ...editNewGift, id: Date.now(), price: parseFloat(editNewGift.price) || 0 }]
      })
      setEditNewGift({ name: '', link: '', price: '', note: '', done: false })
    }
  }

  const saveEditEvent = (e) => {
    e.preventDefault()
    setEvents(events.map(ev => ev.id === editEventData.id ? { ...editEventData } : ev))
    setShowEditEvent(false)
    setSelectedEvent({ ...editEventData })
  }

  const getVaultGifts = () => {
    try {
      const vault = JSON.parse(localStorage.getItem('memoryVaultGifts') || '[]')
      return Array.isArray(vault) ? vault : []
    } catch {
      return []
    }
  }

  const addVaultGiftToNewEvent = (gift) => {
    setNewEvent({
      ...newEvent,
      gifts: [...newEvent.gifts, { ...gift, id: Date.now() + Math.random() }]
    })
    setShowVaultPicker(false)
  }

  const addVaultGiftToEditEvent = (gift) => {
    setEditEventData({
      ...editEventData,
      gifts: [...editEventData.gifts, { ...gift, id: Date.now() + Math.random() }]
    })
    setShowVaultPicker(false)
  }

  useEffect(() => {
    healthCheck().then(res => {
      if (res.data.message && res.data.message.toLowerCase().includes('demo mode')) {
        setEvents([
          {
            id: 1,
            name: "Mom's Birthday",
            date: "2025-03-15",
            gifts: [
              { id: 1, name: "Flowers", link: "https://example.com", price: 25, note: "Her favorite roses", done: false },
              { id: 2, name: "Book", link: "https://example.com", price: 15, note: "New mystery novel", done: true },
              { id: 3, name: "Spa Day", link: "https://example.com", price: 80, note: "Relaxation package", done: false }
            ],
            status: 'pending'
          },
          {
            id: 2,
            name: "Dad's Anniversary",
            date: "2025-04-20",
            gifts: [
              { id: 4, name: "Watch", link: "https://example.com", price: 150, note: "Classic design", done: false },
              { id: 5, name: "Dinner Reservation", link: "https://example.com", price: 60, note: "His favorite restaurant", done: false }
            ],
            status: 'pending'
          },
          {
            id: 3,
            name: "Sister's Graduation",
            date: "2025-05-10",
            gifts: [
              { id: 6, name: "Laptop", link: "https://example.com", price: 800, note: "For her studies", done: true },
              { id: 7, name: "Gift Card", link: "https://example.com", price: 50, note: "For shopping", done: true }
            ],
            status: 'completed'
          },
          {
            id: 4,
            name: "Valentine's Day",
            date: "2025-02-14",
            gifts: [
              { id: 8, name: "Chocolate Box", link: "https://example.com", price: 30, note: "Her favorite dark chocolate", done: false },
              { id: 9, name: "Romantic Dinner", link: "https://example.com", price: 120, note: "At her favorite restaurant", done: false },
              { id: 10, name: "Rose Bouquet", link: "https://example.com", price: 45, note: "Red roses", done: false }
            ],
            status: 'pending'
          },
          {
            id: 5,
            name: "Christmas",
            date: "2025-12-25",
            gifts: [
              { id: 11, name: "Family Photo Session", link: "https://example.com", price: 200, note: "Professional photos", done: false },
              { id: 12, name: "Gift Cards", link: "https://example.com", price: 100, note: "For everyone", done: false }
            ],
            status: 'pending'
          },
          {
            id: 6,
            name: "Best Friend's Wedding",
            date: "2025-08-15",
            gifts: [
              { id: 13, name: "Wedding Gift", link: "https://example.com", price: 150, note: "Kitchen appliance", done: true },
              { id: 14, name: "Bridal Shower Gift", link: "https://example.com", price: 80, note: "Spa package", done: true }
            ],
            status: 'completed'
          }
        ])
      } else {
        setEvents([])
      }
      setLoadingDemo(false)
    }).catch(() => {
      setEvents([])
      setLoadingDemo(false)
    })
  }, [])

  if (loadingDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="vintage-goods text-xl text-red-800">Loading Home...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-red-900 to-red-800 lace-border relative flex-shrink-0">
        <div className="px-6 py-4">
          <h1 className="vintage-goods text-3xl text-red-900 mb-2">Heartboard</h1>
          <p className="times-roman text-sm text-red-900 italic">
            "The greatest gift is not found in a store or under a tree, but in the hearts of true friends."
          </p>
          {user && (
            <p className="times-roman text-xs text-red-800 mt-2">
              Welcome back, {user.name}! 💝
            </p>
          )}
        </div>
      </div>

      {/* Category Tabs and Add Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-800 text-white'
                    : 'text-gray-600 hover:text-red-800 hover:bg-red-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddEvent(true)}
            className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Events Grid - Fixed scrolling */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#dc2626 #f3f4f6' }}>
        <div className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Calendar className="mx-auto mb-4 w-12 h-12 text-red-300" />
              <p className="text-lg">No events yet. Add your first event to get started!</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {filteredEvents.map(event => (
              <motion.div
                key={event.id}
                className="envelope rounded-lg p-6 cursor-pointer bg-white shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openEvent(event)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="vintage-goods text-xl text-gray-800">{event.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'completed' ? 'bg-green-100 text-green-800' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {event.status}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteEvent(event.id) }}
                    className="ml-2 p-1 rounded-full hover:bg-red-100"
                    title="Delete Event"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                
                <p className="times-roman text-sm text-gray-600 mb-4">
                  {(() => { 
                    const d = new Date(event.date); 
                    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`; 
                  })()}
                </p>

                <div className="space-y-2">
                  {event.gifts.slice(0, 3).map(gift => (
                    <div key={gift.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={gift.done}
                          onChange={e => { e.stopPropagation(); toggleGiftStatus(event.id, gift.id) }}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mr-2"
                          onClick={e => e.stopPropagation()}
                        />
                        <span className={`times-roman text-sm ${gift.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{gift.name}</span>
                      </div>
                      <span className="times-roman text-sm font-medium text-red-800">{gift.price}</span>
                    </div>
                  ))}
                  {event.gifts.length > 3 && (
                    <p className="times-roman text-xs text-gray-500">
                      +{event.gifts.length - 3} more gifts
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="times-roman text-sm font-medium text-gray-800">Total:</span>
                    <span className="vintage-goods text-lg text-red-800">{event.gifts.reduce((sum, gift) => sum + gift.price, 0)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="vintage-goods text-3xl text-gray-800">{selectedEvent.name}</h2>
                  <p className="times-roman text-lg text-gray-600">
                    {(() => { 
                      const d = new Date(selectedEvent.date); 
                      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`; 
                    })()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Close"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
                  <button
                    onClick={() => openEditEvent(selectedEvent)}
                    className="p-2 hover:bg-yellow-100 rounded-full transition-colors"
                    title="Edit Event"
                  >
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </button>
                  <button
                    onClick={() => deleteEvent(selectedEvent.id)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    title="Delete Event"
                  >
                    <X className="w-6 h-6 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedEvent.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedEvent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                  </span>
                  <span className="times-roman text-sm text-gray-600">
                    {selectedEvent.gifts.length} gifts • Total: {event.gifts.reduce((sum, gift) => sum + gift.price, 0)}
                  </span>
                </div>

                {/* Gifts List */}
                <div>
                  <h3 className="vintage-goods text-xl text-gray-800 mb-4">Gift List</h3>
                  <div className="space-y-3">
                    {selectedEvent.gifts.map(gift => (
                      <div key={gift.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={gift.done}
                              onChange={() => toggleGiftStatus(selectedEvent.id, gift.id)}
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <div>
                              <h4 className={`font-medium ${gift.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {gift.name}
                              </h4>
                              {gift.note && (
                                <p className="times-roman text-sm text-gray-600 mt-1">{gift.note}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="vintage-goods text-lg font-medium text-red-800">{gift.price}</span>
                          {gift.link && (
                            <a
                              href={gift.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddEvent && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddEvent(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="vintage-goods text-2xl text-gray-800">Add New Event</h2>
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={addEvent} className="space-y-6">
                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                      Event Name
                    </label>
                    <input
                      type="text"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Mom's Birthday"
                      required
                    />
                  </div>
                  <div>
                    <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>

                {/* Add Gifts Section */}
                <div>
                  <h3 className="vintage-goods text-lg text-gray-800 mb-4">Add Gifts</h3>
                  
                  {/* Gift Input Form */}
                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={() => { setShowVaultPicker(true); setVaultPickerTarget('add') }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Pick from Vault
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <input
                      type="text"
                      value={newGift.name}
                      onChange={(e) => setNewGift({...newGift, name: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Gift name"
                    />
                    <input
                      type="url"
                      value={newGift.link}
                      onChange={(e) => setNewGift({...newGift, link: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Link (optional)"
                    />
                    <input
                      type="number"
                      value={newGift.price}
                      onChange={(e) => setNewGift({...newGift, price: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Price"
                    />
                    <button
                      type="button"
                      onClick={addGiftToEvent}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Add Gift
                    </button>
                  </div>

                  {/* Gift List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newEvent.gifts.map((gift) => (
                      <div key={gift.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{gift.name}</div>
                          <div className="text-sm text-gray-500">{gift.price}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGift(gift.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {showEditEvent && editEventData && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditEvent(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="vintage-goods text-2xl text-gray-800">Edit Event</h2>
                <button
                  onClick={() => setShowEditEvent(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={saveEditEvent} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block times-roman text-sm font-medium text-gray-700 mb-2">Event Name</label>
                    <input
                      type="text"
                      value={editEventData.name}
                      onChange={e => handleEditEventChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block times-roman text-sm font-medium text-gray-700 mb-2">Event Date</label>
                    <input
                      type="date"
                      value={editEventData.date}
                      onChange={e => handleEditEventChange('date', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editEventData.status}
                    onChange={e => handleEditEventChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
                <div>
                  <h3 className="vintage-goods text-lg text-gray-800 mb-4">Edit Gifts</h3>
                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={() => { setShowVaultPicker(true); setVaultPickerTarget('edit') }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Pick from Vault
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <input
                      type="text"
                      value={editNewGift.name}
                      onChange={e => setEditNewGift({ ...editNewGift, name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Gift name"
                    />
                    <input
                      type="url"
                      value={editNewGift.link}
                      onChange={e => setEditNewGift({ ...editNewGift, link: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Link (optional)"
                    />
                    <input
                      type="number"
                      value={editNewGift.price}
                      onChange={e => setEditNewGift({ ...editNewGift, price: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Price"
                    />
                    <button
                      type="button"
                      onClick={addEditGift}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Add Gift
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {editEventData.gifts.map(gift => (
                      <div key={gift.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <input
                            type="checkbox"
                            checked={gift.done}
                            onChange={e => handleEditGiftChange(gift.id, 'done', e.target.checked)}
                            className="mr-2 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                          <input
                            type="text"
                            value={gift.name}
                            onChange={e => handleEditGiftChange(gift.id, 'name', e.target.value)}
                            className="font-medium px-2 py-1 rounded border border-gray-200 mr-2"
                          />
                          <input
                            type="number"
                            value={gift.price}
                            onChange={e => handleEditGiftChange(gift.id, 'price', e.target.value)}
                            className="text-sm text-gray-500 px-2 py-1 rounded border border-gray-200 mr-2"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEditGift(gift.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditEvent(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vault Picker Modal */}
      <AnimatePresence>
        {showVaultPicker && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVaultPicker(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="vintage-goods text-2xl text-gray-800">Pick a Gift from Memory Vault</h2>
                <button
                  onClick={() => setShowVaultPicker(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getVaultGifts().length === 0 ? (
                  <div className="col-span-2 text-center text-gray-500">No gifts in your Memory Vault.</div>
                ) : (
                  getVaultGifts().map(gift => (
                    <div key={gift.id} className="bg-gray-50 rounded-lg p-4 flex flex-col items-start shadow">
                      <div className="font-medium text-lg mb-1">{gift.name}</div>
                      <div className="text-sm text-gray-500 mb-1">{gift.category}</div>
                      <div className="text-sm text-gray-700 mb-1">{gift.receiver}</div>
                      <div className="text-sm text-red-800 mb-2">{gift.price}</div>
                      <button
                        type="button"
                        onClick={() => vaultPickerTarget === 'add' ? addVaultGiftToNewEvent(gift) : addVaultGiftToEditEvent(gift)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Add to Event
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
