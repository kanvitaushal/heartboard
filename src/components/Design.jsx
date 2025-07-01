import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Brush, Eraser, Download, Share, ExternalLink, Image, Type, Square, Circle, Triangle } from 'lucide-react'
import toast from 'react-hot-toast'

const Design = () => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState('brush')
  const [color, setColor] = useState('#DC143C')
  const [brushSize, setBrushSize] = useState(5)
  const [designs, setDesigns] = useState([])
  const [startPoint, setStartPoint] = useState(null)
  const [previewShape, setPreviewShape] = useState(null)

  const colors = [
    '#DC143C', '#FF6B6B', '#FF8E8E', '#FFB3B3', // Reds
    '#8B0000', '#A52A2A', '#CD5C5C', '#F08080', // Dark Reds
    '#FFD700', '#FFA500', '#FF8C00', '#FF6347', // Oranges
    '#32CD32', '#90EE90', '#98FB98', '#00FF7F', // Greens
    '#4169E1', '#87CEEB', '#00BFFF', '#1E90FF', // Blues
    '#9370DB', '#DDA0DD', '#D8BFD8', '#E6E6FA', // Purples
    '#000000', '#696969', '#808080', '#C0C0C0'  // Grays
  ]

  const tools = [
    { id: 'brush', icon: Brush, label: 'Brush' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'square', icon: Square, label: 'Square' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    // Set initial styles
    ctx.fillStyle = '#FFF8DC'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (tool === 'brush' || tool === 'eraser') {
      setIsDrawing(true)
      const ctx = canvas.getContext('2d')
      ctx.beginPath()
      ctx.moveTo(x, y)
    } else if (tool === 'square' || tool === 'circle' || tool === 'triangle') {
      setIsDrawing(true)
      setStartPoint({ x, y })
      setPreviewShape(null)
    }
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (tool === 'brush' || tool === 'eraser') {
      ctx.strokeStyle = tool === 'eraser' ? '#FFF8DC' : color
      ctx.lineWidth = brushSize
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if ((tool === 'square' || tool === 'circle' || tool === 'triangle') && startPoint) {
      // Show preview shape (optional, not drawn on canvas)
      setPreviewShape({ x1: startPoint.x, y1: startPoint.y, x2: x, y2: y, tool })
    }
  }

  const stopDrawing = (e) => {
    if (!isDrawing) return
    setIsDrawing(false)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (tool === 'brush' || tool === 'eraser') {
      // End freehand
      return
    }
    if ((tool === 'square' || tool === 'circle' || tool === 'triangle') && startPoint) {
      const rect = canvas.getBoundingClientRect()
      const x = e?.clientX ? e.clientX - rect.left : startPoint.x
      const y = e?.clientY ? e.clientY - rect.top : startPoint.y
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      if (tool === 'square') {
        ctx.strokeRect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y)
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2))
        ctx.beginPath()
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
        ctx.stroke()
      } else if (tool === 'triangle') {
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(x, y)
        ctx.lineTo(2 * startPoint.x - x, y)
        ctx.closePath()
        ctx.stroke()
      }
      setStartPoint(null)
      setPreviewShape(null)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFF8DC'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    toast.success('Canvas cleared! 🎨')
  }

  const saveDesign = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'heartboard-design.png'
    link.href = canvas.toDataURL()
    link.click()
    toast.success('Design saved! 💾')
  }

  const openCanva = () => {
    window.open('https://www.canva.com', '_blank')
    toast.success('Opening Canva in new tab! 🎨')
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <h1 className="vintage-goods text-4xl text-red-800 mb-2">Design Studio</h1>
        <p className="times-roman text-lg text-gray-600">
          Create beautiful designs, cards, and visual gifts
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tools Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tools */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="vintage-goods text-xl text-gray-800 mb-4">Tools</h3>
                <div className="grid grid-cols-2 gap-3">
                  {tools.map((toolItem) => {
                    const Icon = toolItem.icon
                    return (
                      <button
                        key={toolItem.id}
                        onClick={() => setTool(toolItem.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          tool === toolItem.id
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-25'
                        }`}
                      >
                        <div className="text-center">
                          <Icon className="w-5 h-5 mx-auto mb-1" />
                          <div className="times-roman text-xs">{toolItem.label}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Colors */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="vintage-goods text-xl text-gray-800 mb-4">Colors</h3>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => setColor(colorOption)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                        color === colorOption ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorOption }}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Size */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="vintage-goods text-xl text-gray-800 mb-4">Brush Size</h3>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="vintage-goods text-xl text-gray-800 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={clearCanvas}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eraser className="w-4 h-4" />
                    <span>Clear Canvas</span>
                  </button>
                  <button
                    onClick={saveDesign}
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Save Design</span>
                  </button>
                  <button
                    onClick={openCanva}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Canva</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="vintage-goods text-xl text-gray-800">Canvas</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Tool: {tool}</span>
                    <span>•</span>
                    <span>Size: {brushSize}</span>
                  </div>
                </div>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-96 cursor-crosshair bg-amber-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Designs Gallery */}
          {designs.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Palette className="mx-auto mb-4 w-12 h-12 text-red-300" />
              <p className="text-lg">No designs yet. Create your first masterpiece!</p>
            </div>
          ) : (
            <div className="mt-8">
              <h3 className="vintage-goods text-2xl text-gray-800 mb-6">Saved Designs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design) => (
                  <motion.div
                    key={design.id}
                    className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-4xl mb-4 text-center">{design.thumbnail}</div>
                    <h4 className="vintage-goods text-lg text-gray-800 mb-2">{design.name}</h4>
                    <p className="times-roman text-sm text-gray-600 mb-2 capitalize">{design.type}</p>
                    <p className="times-roman text-xs text-gray-500">{design.date}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Design 