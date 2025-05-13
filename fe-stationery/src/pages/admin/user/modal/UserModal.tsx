import React, { useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { TextInput } from '~/components/styles/TextInput'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (user: any) => void
  user?: any
  isEdit?: boolean
}

const UserModal = ({ isOpen, onClose, onSubmit, user, isEdit }: Props) => {
  const [formData, setFormData] = useState(
    user || {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      phone: '',
      dob: '',
      avatar: '',
      active: true
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === 'active' ? value === 'true' : value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white p-8 rounded-3xl shadow-xl w-full max-w-xl'>
        <h2 className='text-2xl font-semibold text-blue-600 mb-6 text-center'>
          {isEdit ? 'Edit User' : 'Add New User'}
        </h2>
        <div className='flex flex-col gap-6'>
          {/* Avatar Upload & Preview */}
          <div className='relative w-32 h-32 mx-auto'>
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt='Avatar'
                className='w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-md'
              />
            ) : (
              <div className='w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-xl text-gray-600'>
                No Avatar
              </div>
            )}
            {/* Upload Icon Overlay */}
            <label className='absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-blue-700 transition'>
              <FiCamera size={18} />
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              />
            </label>
          </div>

          {/* Grid input fields */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <TextInput label='First Name' name='firstName' value={formData.firstName} onChange={handleChange} />
            <TextInput label='Last Name' name='lastName' value={formData.lastName} onChange={handleChange} />
            <TextInput label='Email' name='email' type='email' value={formData.email} onChange={handleChange} />
            <TextInput label='Phone' name='phone' type='tel' value={formData.phone} onChange={handleChange} />
            <TextInput label='Date of Birth' name='dob' type='date' value={formData.dob} onChange={handleChange} />
          </div>

          {/* Role select */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            >
              <option value=''>Select Role</option>
              <option value='Admin'>Admin</option>
              <option value='User'>User</option>
              <option value='Moderator'>Moderator</option>
            </select>
          </div>

          {/* Active status select */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
            <select
              name='active'
              value={formData.active.toString()}
              onChange={handleChange}
              className='w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            >
              <option value='true'>Active</option>
              <option value='false'>Inactive</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className='flex justify-end gap-4 pt-2'>
            <button
              onClick={onClose}
              className='px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition'
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(formData)}
              className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
            >
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserModal
