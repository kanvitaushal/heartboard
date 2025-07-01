import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CheckCircle, Circle, Trash2, ShoppingBag, List, X, ArrowUp, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'

const TodoList = () => {
  const [activeTab, setActiveTab] = useState('gifts')
  const [giftItems, setGiftItems] = useState([])
  
  const [todoItems, setTodoItems] = useState([])

  const [newGiftItem, setNewGiftItem] = useState('')
  const [newTodoItem, setNewTodoItem] = useState('')

  const toggleGiftItem = (id) => {
    setGiftItems(giftItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const toggleTodoItem = (id) => {
    setTodoItems(todoItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const addGiftItem = (e) => {
    e.preventDefault()
    if (newGiftItem.trim()) {
      const item = {
        id: Date.now(),
        text: newGiftItem,
        completed: false,
        category: 'gifts'
      }
      setGiftItems([...giftItems, item])
      setNewGiftItem('')
      toast.success('Gift item added! 🎁')
    }
  }

  const addTodoItem = (e) => {
    e.preventDefault()
    if (newTodoItem.trim()) {
      const item = {
        id: Date.now(),
        text: newTodoItem,
        completed: false,
        priority: 'medium'
      }
      setTodoItems([...todoItems, item])
      setNewTodoItem('')
      toast.success('To-do item added! ✅')
    }
  }

  const deleteGiftItem = (id) => {
    setGiftItems(giftItems.filter(item => item.id !== id))
    toast.success('Item removed! 🗑️')
  }

  const deleteTodoItem = (id) => {
    setTodoItems(todoItems.filter(item => item.id !== id))
    toast.success('Item removed! 🗑️')
  }

  const moveTodoItemUp = (index) => {
    if (index === 0) return
    setTodoItems(items => {
      const newItems = [...items]
      const temp = newItems[index - 1]
      newItems[index - 1] = newItems[index]
      newItems[index] = temp
      return newItems
    })
  }

  const moveTodoItemDown = (index) => {
    setTodoItems(items => {
      if (index === items.length - 1) return items
      const newItems = [...items]
      const temp = newItems[index + 1]
      newItems[index + 1] = newItems[index]
      newItems[index] = temp
      return newItems
    })
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <h1 className="vintage-goods text-4xl text-red-800 mb-2">To Do</h1>
        <p className="times-roman text-lg text-gray-600">
          Keep track of your gift shopping and tasks
        </p>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('gifts')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'gifts'
                ? 'bg-white text-red-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Gift Shopping</span>
          </button>
          <button
            onClick={() => setActiveTab('todo')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'todo'
                ? 'bg-white text-red-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <List className="w-5 h-5" />
            <span>To Do List</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Gift Shopping Tab */}
          {activeTab === 'gifts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Add Gift Item Form */}
              <form onSubmit={addGiftItem} className="mb-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newGiftItem}
                    onChange={(e) => setNewGiftItem(e.target.value)}
                    placeholder="Add gift shopping item..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Gift Items List */}
              <div className="space-y-3">
                {giftItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <ShoppingBag className="mx-auto mb-2 w-10 h-10 text-red-300" />
                    <p>No gift shopping items yet. Add your first one!</p>
                  </div>
                ) : (
                  giftItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleGiftItem(item.id)}
                          className="flex-shrink-0"
                        >
                          {item.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400 hover:text-red-500" />
                          )}
                        </button>
                        
                        <span className={`flex-1 times-roman text-lg ${
                          item.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}>
                          {item.text}
                        </span>
                        
                        <button
                          onClick={() => deleteGiftItem(item.id)}
                          className="flex-shrink-0 p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Progress Summary */}
              <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
                <h3 className="vintage-goods text-xl text-gray-800 mb-4">Shopping Progress</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-600 to-red-800 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(giftItems.filter(item => item.completed).length / giftItems.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="times-roman text-sm text-gray-600">
                    {giftItems.filter(item => item.completed).length} of {giftItems.length} completed
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* To Do List Tab */}
          {activeTab === 'todo' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Add Todo Item Form */}
              <form onSubmit={addTodoItem} className="mb-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newTodoItem}
                    onChange={(e) => setNewTodoItem(e.target.value)}
                    placeholder="Add to-do item..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Todo Items List */}
              <div className="space-y-3">
                {todoItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <List className="mx-auto mb-2 w-10 h-10 text-red-300" />
                    <p>No to-do items yet. Add your first one!</p>
                  </div>
                ) : (
                  todoItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleTodoItem(item.id)}
                          className="flex-shrink-0"
                        >
                          {item.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400 hover:text-red-500" />
                          )}
                        </button>
                        
                        <span className={`flex-1 times-roman text-lg ${
                          item.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}>
                          {item.text}
                        </span>
                        
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => moveTodoItemUp(idx)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                            disabled={idx === 0}
                            title="Move Up"
                          >
                            <ArrowUp className={`w-4 h-4 ${idx === 0 ? 'text-gray-300' : 'text-gray-500'}`} />
                          </button>
                          <button
                            onClick={() => moveTodoItemDown(idx)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                            disabled={idx === todoItems.length - 1}
                            title="Move Down"
                          >
                            <ArrowDown className={`w-4 h-4 ${idx === todoItems.length - 1 ? 'text-gray-300' : 'text-gray-500'}`} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => deleteTodoItem(item.id)}
                          className="flex-shrink-0 p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Progress Summary */}
              <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
                <h3 className="vintage-goods text-xl text-gray-800 mb-4">To-do Progress</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-600 to-red-800 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(todoItems.filter(item => item.completed).length / todoItems.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="times-roman text-sm text-gray-600">
                    {todoItems.filter(item => item.completed).length} of {todoItems.length} completed
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoList 