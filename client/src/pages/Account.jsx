import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Camera, Lock, Save, Plus, Trash2, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, updateUserProfile, changeUserPassword, getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress, setDefaultAddress, uploadAvatar } from '../api/userService'
import toast from 'react-hot-toast'

export default function Account() {
  const { isLoggedIn, user: authUser, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const [avatarPreview, setAvatarPreview] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState({ label: '', street: '', city: '', state: '', zipCode: '', country: '', phone: '', isDefault: false })
  const [savingAddress, setSavingAddress] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/')
      return
    }
    loadProfile()
    loadAddresses()
  }, [isLoggedIn])

  const loadProfile = async () => {
    try {
      const data = await getUserProfile()
      if (data?.success) {
        setProfile(data.profile || data.user)
        setName(data.profile?.name || data.user?.name || '')
        setEmail(data.profile?.email || data.user?.email || '')
        setPhone(data.profile?.phone || data.user?.phone || '')
      }
    } catch (err) {
      console.error('Load profile error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadAddresses = async () => {
    try {
      const data = await getUserAddresses()
      if (data?.success) {
        setAddresses(data.addresses || data.data || [])
      }
    } catch (err) {
      console.error('Load addresses error:', err)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const data = await updateUserProfile({ name, email, phone })
      if (data?.success) {
        toast.success('Profile updated successfully')
        loadProfile()
      } else {
        toast.error(data?.message || 'Failed to update profile')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setChangingPassword(true)
    try {
      const data = await changeUserPassword(oldPassword, newPassword)
      if (data?.success) {
        toast.success('Password changed successfully')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data?.message || 'Failed to change password')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('avatar', file)
    uploadAvatarFile(formData)
  }

  const uploadAvatarFile = async (formData) => {
    try {
      const data = await uploadAvatar(formData)
      if (data?.success) {
        toast.success('Avatar updated')
        updateUser({ avatar: data.avatarUrl })
        loadProfile()
      } else {
        toast.error(data?.message || 'Failed to upload avatar')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to upload avatar')
    }
  }

  const resetAddressForm = () => {
    setAddressForm({ label: '', street: '', city: '', state: '', zipCode: '', country: '', phone: '', isDefault: false })
    setEditingAddress(null)
    setShowAddressForm(false)
  }

  const handleEditAddress = (addr) => {
    setAddressForm({ ...addr })
    setEditingAddress(addr)
    setShowAddressForm(true)
  }

  const handleSaveAddress = async () => {
    if (!addressForm.label || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
      toast.error('Please fill in all required fields')
      return
    }
    setSavingAddress(true)
    try {
      let data
      if (editingAddress) {
        data = await updateUserAddress(editingAddress._id, addressForm)
      } else {
        data = await addUserAddress(addressForm)
      }
      if (data?.success) {
        toast.success(editingAddress ? 'Address updated' : 'Address added')
        resetAddressForm()
        loadAddresses()
      } else {
        toast.error(data?.message || 'Failed to save address')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save address')
    } finally {
      setSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return
    try {
      const data = await deleteUserAddress(addressId)
      if (data?.success) {
        toast.success('Address deleted')
        loadAddresses()
      } else {
        toast.error(data?.message || 'Failed to delete address')
      }
    } catch (err) {
      toast.error('Failed to delete address')
    }
  }

  const handleSetDefault = async (addressId) => {
    try {
      const data = await setDefaultAddress(addressId)
      if (data?.success) {
        toast.success('Default address updated')
        loadAddresses()
      } else {
        toast.error(data?.message || 'Failed to set default address')
      }
    } catch (err) {
      toast.error('Failed to set default address')
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="bg-white rounded-2xl p-8 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
  ]

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-1">Manage your profile, addresses, and security</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 text-center border-b border-gray-100">
                  <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center overflow-hidden mx-auto">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                    ) : profile?.avatar ? (
                      <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gold-500" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 bg-gold-500 text-white rounded-full flex items-center justify-center hover:bg-gold-600 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
                </div>
                <h2 className="font-semibold text-gray-900 mt-3">{profile?.name || 'User'}</h2>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gold-50 text-gold-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-500" />
                  Personal Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gold-500" />
                    My Addresses
                  </h3>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Address
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Label *</label>
                        <input
                          type="text"
                          value={addressForm.label}
                          onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                          placeholder="Home, Office, etc."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Street Address *</label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">State *</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">ZIP Code *</label>
                        <input
                          type="text"
                          value={addressForm.zipCode}
                          onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Country *</label>
                        <input
                          type="text"
                          value={addressForm.country}
                          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          placeholder="United Kingdom"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          className="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
                        />
                        <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={handleSaveAddress} disabled={savingAddress} className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50">
                        {savingAddress ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                      </button>
                      <button onClick={resetAddressForm} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 && !showAddressForm ? (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No addresses saved yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr._id} className={`border-2 rounded-xl p-5 ${addr.isDefault ? 'border-gold-500 bg-gold-50/50' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">{addr.label}</span>
                              {addr.isDefault && <span className="text-xs bg-gold-500 text-white px-2 py-0.5 rounded-full">Default</span>}
                            </div>
                            <p className="text-sm text-gray-600">{addr.street}</p>
                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                            <p className="text-sm text-gray-600">{addr.country}</p>
                            {addr.phone && <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>}
                          </div>
                          <div className="flex gap-2 ml-4">
                            {!addr.isDefault && (
                              <button onClick={() => handleSetDefault(addr._id)} className="text-xs text-gold-600 hover:text-gold-700 font-medium px-3 py-1.5 border border-gold-300 rounded-lg hover:bg-gold-50 transition-colors">
                                Set Default
                              </button>
                            )}
                            <button onClick={() => handleEditAddress(addr)} className="text-gray-500 hover:text-gray-700 p-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-500 hover:text-red-700 p-1.5">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gold-500" />
                  Change Password
                </h3>
                <div className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword || !oldPassword || !newPassword || !confirmPassword}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
