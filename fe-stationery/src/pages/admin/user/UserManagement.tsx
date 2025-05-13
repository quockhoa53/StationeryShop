import { useState } from 'react'
import { useAppDispatch } from '~/hooks/redux'
import { modalActions } from '~/store/slices/modal'
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaSearch, FaEye } from 'react-icons/fa'
import UserModal from './modal/UserModal'
import { DetailModal } from './modal/DetailModal'
import { fakeUsers } from '~/constance/seed/user'
import { ConfirmDeleteModal } from './modal/ConfirmDeleteModal'
import Select from 'react-select'

type User = {
  id: number
  avatar?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  active: boolean
  dob: string
}

const roleOptions = [
  { value: 'All', label: 'All Roles' },
  { value: 'Admin', label: 'Admin' },
  { value: 'User', label: 'User' },
  { value: 'Moderator', label: 'Moderator' }
]

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(fakeUsers)
  const dispatch = useAppDispatch()

  const closeModal = () => {
    dispatch(modalActions.toggleModal({ isOpenModal: false, childrenModal: null }))
  }

  const handleAddUser = () => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <UserModal
            isOpen={true}
            isEdit={false}
            onClose={closeModal}
            onSubmit={(user) => {
              setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }])
              closeModal()
            }}
          />
        )
      })
    )
  }

  const handleEditUser = (user: User) => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <UserModal
            isOpen={true}
            isEdit={true}
            user={user}
            onClose={closeModal}
            onSubmit={(updatedUser) => {
              setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
              closeModal()
            }}
          />
        )
      })
    )
  }

  const handleViewUserDetails = (user: User) => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: <DetailModal isOpen={true} user={user} onClose={closeModal} />
      })
    )
  }

  const handleConfirmDelele = (user: User) => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <ConfirmDeleteModal
            isOpen={true}
            onClose={closeModal}
            onConfirm={() => {
              setUsers((prev) => prev.filter((u) => u.id !== user.id))
              closeModal()
            }}
          />
        )
      })
    )
  }

  return (
    <div className='p-6 w-full mx-auto bg-white shadow-lg rounded-xl'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold text-blue-800'>User Management</h1>
        <button
          className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors'
          onClick={handleAddUser}
          aria-label='Add new user'
        >
          <FaPlus size={16} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className='flex gap-4 mb-6'>
        <div className='relative w-1/3'>
          <span className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
            <FaSearch />
          </span>
          <input
            type='text'
            placeholder='Search by name or email...'
            className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
          />
        </div>

        <div className='w-1/4'>
          <Select
            options={roleOptions}
            defaultValue={roleOptions[0]}
            className='basic-single'
            classNamePrefix='select'
            isSearchable={false}
            onChange={(selectedOption) => {
              // TODO: filter logic nếu cần
              console.log('Selected role:', selectedOption?.value)
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className='overflow-x-auto rounded-xl shadow-lg'>
        <table className='w-full border-collapse border border-blue-200'>
          <thead>
            <tr className='bg-blue-600 text-white text-left'>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>#</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>First Name</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Last Name</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Email</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Dob</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Phone</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Role</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Active</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className='border-b border-teal-200 hover:bg-teal-50 transition-colors'>
                <td className='px-4 py-3'>{index + 1}</td>
                <td className='px-4 py-3 font-medium'>{user.firstName}</td>
                <td className='px-4 py-3 font-medium'>{user.lastName}</td>
                <td className='px-4 py-3'>{user.email}</td>
                <td className='px-4 py-3'>{user.dob}</td>
                <td className='px-4 py-3'>{user.phone}</td>
                <td className='px-4 py-3'>{user.role}</td>
                <td className='px-4 py-3'>
                  {user.active ? (
                    <FaCheckCircle className='text-cyan-500' size={20} aria-label='Active' />
                  ) : (
                    <FaTimesCircle className='text-red-500' size={20} aria-label='Inactive' />
                  )}
                </td>
                <td className='px-4 py-3 flex gap-2'>
                  <button
                    className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors'
                    onClick={() => handleViewUserDetails(user)}
                  >
                    <FaEye size={16} />
                  </button>
                  <button
                    className='bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500 transition-colors'
                    aria-label={`Edit user ${user.firstName} ${user.lastName}`}
                    onClick={() => handleEditUser(user)}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors'
                    onClick={() => handleConfirmDelele(user)}
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement
