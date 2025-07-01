import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Sparkles, Gift, Archive, Search, Filter, Bot } from 'lucide-react'
import toast from 'react-hot-toast'

const MemoryVault = () => {
  const [gifts, setGifts] = useState([])

  const [showAddForm, setShowAddForm] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [newGift, setNewGift] = useState({
    name: '',
    category: '',
    receiver: '',
    price: '',
    notes: '',
    image: '🎁'
  })

  const categories = ['all', 'sentimental', 'materialistic', 'other']
  const giftEmojis = ['🎁', '💐', '⌚', '📖', '☕', '🍫', '🎨', '🎵', '💎', '🕯️', '🧸', '📱', '💻', '🎮', '🏃‍♀️', '🧘‍♀️']

  const filteredGifts = gifts.filter(gift => {
    const matchesCategory = selectedCategory === 'all' || gift.category === selectedCategory
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.receiver.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddGift = (e) => {
    e.preventDefault()
    if (newGift.name.trim()) {
      const gift = {
        ...newGift,
        id: Date.now(),
        date: newGift.receiver === 'General' ? null : new Date().toISOString().split('T')[0],
        status: newGift.receiver === 'General' ? 'suggestion' : 'given'
      }
      setGifts([...gifts, gift])
      setNewGift({
        name: '',
        category: '',
        receiver: '',
        price: '',
        notes: '',
        image: '🎁'
      })
      setShowAddForm(false)
      toast.success('Gift added to your vault! 💝')
    }
  }

  const getAIAdvice = () => {
    const suggestions = [
      "For a coffee lover: Consider a personalized coffee mug with their name or favorite quote!",
      "For someone who loves to read: A book by their favorite author or a beautiful bookmark would be perfect.",
      "For a tech enthusiast: Wireless earbuds or a phone stand could be great options.",
      "For someone who loves cooking: A beautiful cutting board or cooking utensils would be appreciated.",
      "For a fitness lover: A yoga mat, water bottle, or fitness tracker could be ideal."
    ]
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 bg-gradient-to-br from-red-50 to-pink-50 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="vintage-goods text-4xl text-red-800 mb-2">Memory Vault</h1>
            <p className="times-roman text-lg text-gray-600">
              Store your gift memories and discover new ideas
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gifts or recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowAI(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-all duration-200 flex items-center space-x-2"
              >
                <Bot className="w-5 h-5" />
                <span>Ideas</span>
              </button>
            </div>
          </div>

          {/* Add Gift Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Gift to Vault</span>
            </button>
          </div>

          {/* Gifts Grid */}
          {filteredGifts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Archive className="mx-auto mb-4 w-12 h-12 text-red-300" />
              <p className="text-lg">No gifts in your vault yet. Add your first memory!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
              {filteredGifts.map((gift) => (
                <motion.div
                  key={gift.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">
                      {gift.image}
                    </div>
                    <h3 className="vintage-goods text-lg text-gray-800 mb-2">
                      {gift.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      gift.status === 'given' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {gift.status === 'given' ? 'Given' : 'Suggestion'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{gift.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Receiver:</span>
                      <span className="font-medium">{gift.receiver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-red-800">${gift.price}</span>
                    </div>
                  </div>

                  {gift.notes && (
                    <p className="mt-3 text-sm text-gray-600 italic">
                      "{gift.notes}"
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Advice Modal */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAI(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="vintage-goods text-2xl text-gray-800 mb-2">Gift Ideas Assistant</h2>
                <p className="times-roman text-sm text-gray-600">
                  Let me help you find the perfect gift!
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="times-roman text-sm text-gray-700">
                  💡 <strong>Gift Suggestion:</strong><br/>
                  {getAIAdvice()}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="vintage-goods text-lg text-gray-800">Quick Tips:</h3>
                <ul className="times-roman text-sm text-gray-600 space-y-2">
                  <li>• Consider their hobbies and interests</li>
                  <li>• Think about what they might need but wouldn't buy themselves</li>
                  <li>• Personal touches make gifts more meaningful</li>
                  <li>• Experiences can be more memorable than things</li>
                </ul>
              </div>

              <button
                onClick={() => setShowAI(false)}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-all duration-200"
              >
                Thanks for the advice!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Gift Modal */}
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
                Add Gift to Vault
              </h2>

              <form onSubmit={handleAddGift} className="space-y-4">
                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Gift Name
                  </label>
                  <input
                    type="text"
                    value={newGift.name}
                    onChange={(e) => setNewGift({...newGift, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Handmade Scrapbook"
                    required
                  />
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newGift.category}
                    onChange={(e) => setNewGift({...newGift, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    For (Recipient)
                  </label>
                  <input
                    type="text"
                    value={newGift.receiver}
                    onChange={(e) => setNewGift({...newGift, receiver: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Mom, Sarah, or 'General' for suggestions"
                    required
                  />
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Price (optional)
                  </label>
                  <input
                    type="number"
                    value={newGift.price}
                    onChange={(e) => setNewGift({...newGift, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0 for handmade gifts"
                  />
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newGift.notes}
                    onChange={(e) => setNewGift({...newGift, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="3"
                    placeholder="How did they react? Any special memories?"
                  />
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Choose Emoji
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {giftEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewGift({...newGift, image: emoji})}
                        className={`text-2xl p-2 rounded-lg transition-colors ${
                          newGift.image === emoji ? 'bg-red-100 border-2 border-red-500' : 'hover:bg-gray-100'
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
                    Add to Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MemoryVault 