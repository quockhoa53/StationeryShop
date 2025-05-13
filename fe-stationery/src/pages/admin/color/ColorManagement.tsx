import { useState } from 'react'
import { useAppDispatch } from '~/hooks/redux'
import { modalActions } from '~/store/slices/modal'
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { Color } from '~/types/product'
import { fakeColors } from '~/constance/seed/mockColors'
import ColorModal from './modal/ColorModal'
import Swal from 'sweetalert2'

const ColorManagement = () => {
  const [colors, setColors] = useState<Color[]>(fakeColors)
  const dispatch = useAppDispatch()

  const closeModal = () => {
    dispatch(modalActions.toggleModal({ isOpenModal: false, childrenModal: null }))
  }

  const handleAddColor = () => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <ColorModal
            isOpen={true}
            isEdit={false}
            onClose={closeModal}
            onSubmit={(color) => {
              setColors((prev) => [...prev, { ...color, id: prev.length + 1 }])
              closeModal()
            }}
          />
        )
      })
    )
  }

  const handleEditColor = (color: Color) => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <ColorModal
            isOpen={true}
            isEdit={true}
            color={color}
            onClose={closeModal}
            onSubmit={(updatedColor) => {
              setColors((prev) => prev.map((u) => (u.colorId === updatedColor.colorId ? updatedColor : u)))
              closeModal()
            }}
          />
        )
      })
    )
  }

  const handleConfirmDeleleColor = async (id: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn chắc chắn muốn xóa sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })

    if (result.isConfirmed) {
      setColors((prev) => prev.filter((p) => p.colorId !== id))
      Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa.', 'success')
    }
  }

  return (
    <div className='p-6 w-full mx-auto bg-white shadow-lg rounded-xl'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold text-blue-800'>Product Color Management</h1>
        <button
          className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors'
          onClick={handleAddColor}
          aria-label='Add new color'
        >
          <FaPlus size={16} />
          Add New Color
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
            placeholder='Search by color name or color hex...'
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
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Color Name</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Color Hex</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color, index) => (
              <tr key={color.colorId} className='border-b border-teal-200 hover:bg-teal-50 transition-colors'>
                <td className='px-4 py-3'>{index + 1}</td>
                <td className='px-4 py-3 font-medium'>{color.name}</td>
                <td className='px-4 py-3'>
                  <span
                    className='inline-block w-6 h-6 rounded-full border border-gray-300'
                    style={{ backgroundColor: color.hex }}
                  ></span>{' '}
                  {color.hex}
                </td>
                <td className='px-4 py-3 flex gap-2'>
                  <button
                    className='bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500 transition-colors'
                    onClick={() => handleEditColor(color)}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleConfirmDeleleColor(color.colorId)
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

export default ColorManagement
