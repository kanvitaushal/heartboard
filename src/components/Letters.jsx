import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Download, Sparkles, PenTool, Heart, Star, Moon, Sun, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

const Letters = () => {
  const [writingMode, setWritingMode] = useState('note')
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [recipient, setRecipient] = useState('')
  const [letters, setLetters] = useState([])

  const writingModes = [
    { id: 'note', label: 'Short Note', icon: PenTool, description: 'Quick messages and simple notes' },
    { id: 'letter', label: 'Long Letter', icon: Heart, description: 'Detailed letters from the heart' },
    { id: 'poem', label: 'Poem', icon: Star, description: 'Express feelings through poetry' },
    { id: 'wish', label: 'Midnight Wish', icon: Moon, description: 'Dreamy and romantic messages' }
  ]

  const getWritingPrompt = (mode) => {
    const prompts = {
      note: "Write a short, sweet message...",
      letter: "Share your thoughts and feelings...",
      poem: "Express your emotions through verse...",
      wish: "Write a dreamy, romantic message..."
    }
    return prompts[mode] || "Start writing..."
  }

  const getAIHelp = () => {
    const suggestions = {
      note: [
        "Keep it simple and heartfelt",
        "Mention a specific memory",
        "Express gratitude or love",
        "End with a warm closing"
      ],
      letter: [
        "Start with a personal greeting",
        "Share recent experiences",
        "Express your feelings openly",
        "Include hopes for the future",
        "End with love and best wishes"
      ],
      poem: [
        "Choose a theme or emotion",
        "Use imagery and metaphors",
        "Consider rhythm and flow",
        "Make it personal and meaningful"
      ],
      wish: [
        "Create a dreamy atmosphere",
        "Use romantic language",
        "Include wishes and dreams",
        "Make it magical and special"
      ]
    }
    return suggestions[writingMode] || []
  }

  const saveLetter = () => {
    if (title.trim() && content.trim()) {
      const letter = {
        id: Date.now(),
        title: title,
        recipient: recipient,
        content: content,
        mode: writingMode,
        date: new Date().toISOString().split('T')[0]
      }
      setLetters([...letters, letter])
      setTitle('')
      setContent('')
      setRecipient('')
      toast.success('Letter saved! 💌')
    } else {
      toast.error('Please add a title and content')
    }
  }

  const downloadLetter = () => {
    if (content.trim()) {
      const element = document.createElement('a')
      const file = new Blob([`${title}\n\n${content}`], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `${title || 'letter'}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      toast.success('Letter downloaded! 📄')
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <h1 className="vintage-goods text-4xl text-red-800 mb-2">Letters</h1>
        <p className="times-roman text-lg text-gray-600">
          Write heartfelt messages, poems, and letters to your loved ones
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Writing Section */}
            <div className="lg:col-span-2">
              {/* Writing Mode Selector */}
              <div className="mb-6">
                <h2 className="vintage-goods text-2xl text-gray-800 mb-4">Choose Writing Mode</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {writingModes.map((mode) => {
                    const Icon = mode.icon
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setWritingMode(mode.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          writingMode === mode.id
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-25'
                        }`}
                      >
                        <div className="text-center">
                          <Icon className="w-6 h-6 mx-auto mb-2" />
                          <div className="vintage-goods text-sm font-medium">{mode.label}</div>
                          <div className="times-roman text-xs text-gray-500 mt-1">
                            {mode.description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Writing Area */}
              <div className="parchment rounded-lg p-8 shadow-lg">
                <div className="mb-6">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Letter title..."
                    className="w-full px-4 py-3 border-b-2 border-gray-300 bg-transparent focus:border-red-500 focus:outline-none vintage-goods text-2xl text-gray-800 placeholder-gray-400"
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="To: (recipient's name)"
                    className="w-full px-4 py-3 border-b border-gray-300 bg-transparent focus:border-red-500 focus:outline-none times-roman text-lg text-gray-700 placeholder-gray-400"
                  />
                </div>

                <div className="mb-6">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={getWritingPrompt(writingMode)}
                    className="w-full h-96 px-4 py-3 border-none bg-transparent focus:outline-none times-roman text-lg text-gray-800 placeholder-gray-400 resize-none leading-relaxed"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={saveLetter}
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Letter</span>
                  </button>
                  <button
                    onClick={downloadLetter}
                    className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-700 hover:to-gray-900 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Help and Saved Letters */}
            <div className="space-y-6">
              {/* AI Writing Help */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="vintage-goods text-xl text-gray-800">Writing Tips</h3>
                </div>
                <div className="space-y-3">
                  {getAIHelp().map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <p className="times-roman text-sm text-gray-600">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Letters */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="vintage-goods text-xl text-gray-800 mb-4">Saved Letters</h3>
                {letters.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Mail className="mx-auto mb-4 w-12 h-12 text-red-300" />
                    <p className="text-lg">No letters yet. Write your first heartfelt message!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {letters.map((letter) => (
                      <motion.div
                        key={letter.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setTitle(letter.title)
                          setRecipient(letter.recipient)
                          setContent(letter.content)
                          setWritingMode(letter.mode)
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="vintage-goods text-lg text-gray-800">{letter.title}</h4>
                          <span className="times-roman text-xs text-gray-500">
                            {new Date(letter.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="times-roman text-sm text-gray-600 mb-2">
                          To: {letter.recipient}
                        </p>
                        <p className="times-roman text-sm text-gray-500 line-clamp-2">
                          {letter.content.substring(0, 100)}...
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          letter.mode === 'poem' ? 'bg-purple-100 text-purple-800' :
                          letter.mode === 'wish' ? 'bg-pink-100 text-pink-800' :
                          letter.mode === 'letter' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {writingModes.find(m => m.id === letter.mode)?.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Templates */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="vintage-goods text-xl text-gray-800 mb-4">Quick Templates</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setWritingMode('note')
                      setContent("Thank you for being such an amazing person in my life. Your kindness and love mean everything to me.")
                    }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-25 transition-colors"
                  >
                    <div className="vintage-goods text-sm text-gray-800">Thank You Note</div>
                    <div className="times-roman text-xs text-gray-500">Express gratitude</div>
                  </button>
                  <button
                    onClick={() => {
                      setWritingMode('poem')
                      setContent("In the garden of our friendship,\nWhere memories bloom and grow,\nYour presence brings such joy to me,\nMore than words could ever show.")
                    }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-25 transition-colors"
                  >
                    <div className="vintage-goods text-sm text-gray-800">Friendship Poem</div>
                    <div className="times-roman text-xs text-gray-500">Celebrate friendship</div>
                  </button>
                  <button
                    onClick={() => {
                      setWritingMode('wish')
                      setContent("As the stars twinkle in the night sky, I make a wish for you. May your dreams come true and may happiness always find its way to your heart.")
                    }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-25 transition-colors"
                  >
                    <div className="vintage-goods text-sm text-gray-800">Midnight Wish</div>
                    <div className="times-roman text-xs text-gray-500">Romantic message</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Letters 