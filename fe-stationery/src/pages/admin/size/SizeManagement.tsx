import { useState } from 'react'
import { useAppDispatch } from '~/hooks/redux'
import { modalActions } from '~/store/slices/modal'
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { Size } from '~/types/product'
import { fakeSizes } from '~/constance/seed/mockSize'
import SizeModal from './modal/SizeModal'
import Swal from 'sweetalert2'

const SizeManagement = () => {
  const [sizes, setSizes] = useState<Size[]>(fakeSizes)
  const dispatch = useAppDispatch()

  const closeModal = () => {
    dispatch(modalActions.toggleModal({ isOpenModal: false, childrenModal: null }))
  }

  const handleAddSize = () => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <SizeModal
            isOpen={true}
            isEdit={false}
            onClose={closeModal}
            onSubmit={(size) => {
              setSizes((prev) => [...prev, { ...size, id: prev.length + 1 }])
              closeModal()
            }}
          />
        )
      })
    )
  }

  const handleEditSize = (size: Size) => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <SizeModal
            isOpen={true}
            isEdit={true}
            size={size}
            onClose={closeModal}
            onSubmit={(updatedSize) => {
              setSizes((prev) => prev.map((u) => (u.sizeId === updatedSize.sizeId ? updatedSize : u)))
              closeModal()
            }}
          />
        )
      })
    )
  }

  const handleConfirmDeleleSize = async (id: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn chắc chắn muốn xóa size này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })

    if (result.isConfirmed) {
      setSizes((prev) => prev.filter((p) => p.sizeId !== id))
      Swal.fire('Đã xóa!', 'Size đã được xóa.', 'success')
    }
  }

  return (
    <div className='p-6 w-full mx-auto bg-white shadow-lg rounded-xl'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold text-blue-800'>Product Size Management</h1>
        <button
          className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-Sizes'
          onClick={handleAddSize}
          aria-label='Add new Size'
        >
          <FaPlus size={16} />
          Add New Size
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
            placeholder='Search by size name...'
            className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
          />
        </div>
      </div>

      {/* Table Section */}
      <div className='overflow-x-auto rounded-xl shadow-lg'>
        <table className='w-full border-collapse border border-blue-200'>
          <thead>
            <tr className='bg-blue-600 text-white text-left'>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>#</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Size Name</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Size Priority</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size, index) => (
              <tr key={size.sizeId} className='border-b border-teal-200 hover:bg-teal-50 transition-Sizes'>
                <td className='px-4 py-3'>{index + 1}</td>
                <td className='px-4 py-3 font-medium'>{size.name}</td>
                <td className='px-4 py-3 font-medium'>{size.priority}</td>
                <td className='px-4 py-3 flex gap-2'>
                  <button
                    className='bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500 transition-Sizes'
                    onClick={() => handleEditSize(size)}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-Sizes'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleConfirmDeleleSize(size.sizeId)
                    }}
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

export default SizeManagement
