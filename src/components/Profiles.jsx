import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Heart, Star, Calendar, Palette, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const Profiles = () => {
  const [profiles, setProfiles] = useState([])

  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProfile, setNewProfile] = useState({
    name: '',
    birthday: '',
    favoriteColor: '',
    notes: '',
    doodle: '👤',
    relationship: ''
  })

  const [showEditForm, setShowEditForm] = useState(false)
  const [editProfile, setEditProfile] = useState(null)

  const doodleOptions = [
    '👤', '👩‍🦰', '👨‍🦱', '👩‍🎨', '👵', '👴', '👧', '👦', '👩‍💼', '👨‍💼',
    '👩‍🍳', '👨‍🍳', '👩‍⚕️', '👨‍⚕️', '👩‍🏫', '👨‍🏫', '🐱', '🐶', '🐰', '🦊'
  ]

  const handleAddProfile = (e) => {
    e.preventDefault()
    if (newProfile.name.trim()) {
      const profile = {
        ...newProfile,
        id: Date.now()
      }
      setProfiles([...profiles, profile])
      setNewProfile({
        name: '',
        birthday: '',
        favoriteColor: '',
        notes: '',
        doodle: '👤',
        relationship: ''
      })
      setShowAddForm(false)
      toast.success('Profile added successfully! 💝')
    }
  }

  const handleEditProfile = (profile) => {
    setEditProfile({ ...profile })
    setShowEditForm(true)
  }

  const handleEditProfileChange = (field, value) => {
    setEditProfile({ ...editProfile, [field]: value })
  }

  const saveEditProfile = (e) => {
    e.preventDefault()
    setProfiles(profiles.map(p => p.id === editProfile.id ? { ...editProfile } : p))
    setShowEditForm(false)
    setSelectedProfile({ ...editProfile })
  }

  const deleteProfile = (id) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      setProfiles(profiles.filter(p => p.id !== id))
      setSelectedProfile(null)
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 bg-gradient-to-br from-red-50 to-pink-50 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="vintage-goods text-4xl text-red-800 mb-2">Profiles</h1>
            <p className="times-roman text-lg text-gray-600">
              Keep track of your loved ones' preferences and special details
            </p>
          </div>

          {/* Add Profile Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Profile</span>
            </button>
          </div>

          {/* Profiles Grid */}
          {profiles.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Users className="mx-auto mb-4 w-12 h-12 text-red-300" />
              <p className="text-lg">No profiles yet. Add your first loved one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
              {profiles.map((profile) => (
                <motion.div
                  key={profile.id}
                  className="profile-card rounded-xl p-6 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4 doodle-float">
                      {profile.doodle}
                    </div>
                    <h3 className="vintage-goods text-xl text-gray-800 mb-2">
                      {profile.name}
                    </h3>
                    <p className="times-roman text-sm text-gray-600 mb-3">
                      {profile.relationship}
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{profile.birthday}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-8xl mb-4 doodle-float">
                  {selectedProfile.doodle}
                </div>
                <h2 className="vintage-goods text-3xl text-gray-800 mb-2">
                  {selectedProfile.name}
                </h2>
                <p className="times-roman text-lg text-gray-600">
                  {selectedProfile.relationship}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="times-roman text-sm font-medium text-gray-700">Birthday</p>
                    <p className="times-roman text-sm text-gray-600">{selectedProfile.birthday}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Palette className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="times-roman text-sm font-medium text-gray-700">Favorite Color</p>
                    <p className="times-roman text-sm text-gray-600">{selectedProfile.favoriteColor}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <p className="times-roman text-sm font-medium text-gray-700">Notes</p>
                    <p className="times-roman text-sm text-gray-600">{selectedProfile.notes}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => handleEditProfile(selectedProfile)}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProfile(selectedProfile.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Profile Modal */}
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
                Add New Profile
              </h2>

              <form onSubmit={handleAddProfile} className="space-y-4">
                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter their name"
                    required
                  />
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={newProfile.relationship}
                    onChange={(e) => setNewProfile({...newProfile, relationship: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Mother, Best Friend, Sister"
                    required
                  />
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Birthday
                  </label>
                  <input
                    type="date"
                    value={newProfile.birthday}
                    onChange={(e) => setNewProfile({...newProfile, birthday: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Favorite Color
                  </label>
                  <input
                    type="text"
                    value={newProfile.favoriteColor}
                    onChange={(e) => setNewProfile({...newProfile, favoriteColor: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Rose Gold, Navy Blue"
                  />
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newProfile.notes}
                    onChange={(e) => setNewProfile({...newProfile, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="3"
                    placeholder="What do they love? Any gift preferences?"
                  />
                </div>

                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">
                    Choose Doodle
                  </label>
                  <div className="grid grid-cols-10 gap-2">
                    {doodleOptions.map((doodle, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewProfile({...newProfile, doodle})}
                        className={`text-2xl p-2 rounded-lg transition-colors ${
                          newProfile.doodle === doodle ? 'bg-red-100 border-2 border-red-500' : 'hover:bg-gray-100'
                        }`}
                      >
                        {doodle}
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
                    Add Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditForm && editProfile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditForm(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="vintage-goods text-2xl text-gray-800 mb-6 text-center">Edit Profile</h2>
              <form onSubmit={saveEditProfile} className="space-y-4">
                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editProfile.name}
                    onChange={e => handleEditProfileChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    value={editProfile.relationship}
                    onChange={e => handleEditProfileChange('relationship', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">Birthday</label>
                  <input
                    type="date"
                    value={editProfile.birthday}
                    onChange={e => handleEditProfileChange('birthday', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">Favorite Color</label>
                  <input
                    type="text"
                    value={editProfile.favoriteColor}
                    onChange={e => handleEditProfileChange('favoriteColor', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={editProfile.notes}
                    onChange={e => handleEditProfileChange('notes', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block times-roman text-sm font-medium text-gray-700 mb-2">Doodle</label>
                  <select
                    value={editProfile.doodle}
                    onChange={e => handleEditProfileChange('doodle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {doodleOptions.map((doodle, idx) => (
                      <option key={idx} value={doodle}>{doodle}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
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
    </div>
  )
}

export default Profiles 