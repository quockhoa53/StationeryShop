import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { useAppDispatch } from '~/hooks/redux'
import { modalActions } from '~/store/slices/modal'
import { fakeCategories } from '~/constance/seed/category'
import { Category } from '~/types/category'
import CategoryModal from './modal/CategoryModal'
import { DeleteModal } from './modal/DeleteModal'

const CategoriesProductManagement = () => {
  const [categories, setCategories] = useState<Category[]>(fakeCategories)
  const dispatch = useAppDispatch()

  const closeModal = () => {
    dispatch(modalActions.toggleModal({ isOpenModal: false, childrenModal: null }))
  }

  const handleAddCategory = () => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <CategoryModal
            isOpen={true}
            isEdit={false}
            onClose={closeModal} // Đảm bảo onClose chỉ được gọi khi nhấn "Cancel"
            onSubmit={(newCategory) => {
              setCategories((prev) => [...prev, { ...newCategory, categoryId: Date.now().toString() }])
              closeModal() // Đóng modal sau khi submit
            }}
          />
        )
      })
    )
  }

  const handleEditCategory = (category: Category) => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <CategoryModal
            isOpen={true}
            isEdit={true}
            category={category}
            onClose={closeModal} // Đảm bảo onClose chỉ được gọi khi nhấn "Cancel"
            onSubmit={(updatedCategory) => {
              setCategories((prev) =>
                prev.map((c) => (c.categoryId === updatedCategory.categoryId ? updatedCategory : c))
              )
              closeModal() // Đóng modal sau khi submit
            }}
          />
        )
      })
    )
  }

  const handleDeleteCategory = (category: Category) => {
    dispatch(
      modalActions.toggleModal({
        isOpenModal: true,
        childrenModal: (
          <DeleteModal
            isOpen={true}
            onClose={closeModal}
            onConfirm={() => {
              setCategories((prev) => prev.filter((u) => u.categoryId !== category.categoryId))
              closeModal()
            }}
          />
        )
      })
    )
  }

  return (
    <div className='p-6 w-full mx-auto bg-white shadow-lg rounded-xl'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold text-blue-800'>Product Categories Management</h1>
        <button
          onClick={handleAddCategory}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors'
        >
          <FaPlus size={16} />
          Add New Category
        </button>
      </div>

      {/* Search */}
      <div className='relative w-1/3 mb-6'>
        <span className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
          <FaSearch />
        </span>
        <input
          type='text'
          placeholder='Search by category name...'
          className='pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
        />
      </div>

      {/* Table */}
      <div className='overflow-x-auto rounded-xl shadow-lg'>
        <table className='w-full border-collapse border border-blue-200'>
          <thead>
            <tr className='bg-blue-600 text-white text-left'>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>#</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Name</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Icon</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Background Color</th>
              <th className='px-4 py-3 font-medium text-sm uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.categoryId} className='border-b border-teal-200 hover:bg-teal-50 transition-colors'>
                <td className='px-4 py-3'>{index + 1}</td>
                <td className='px-4 py-3 font-medium'>{category.categoryName}</td>
                <td className='px-4 py-3 font-medium'>{category.icon}</td>
                <td className='px-4 py-3'>
                  <span
                    className='inline-block w-6 h-6 rounded-full border border-gray-300'
                    style={{ backgroundColor: category.bgColor }}
                  ></span>{' '}
                  {category.bgColor}
                </td>
                <td className='px-4 py-3 flex gap-2'>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className='bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500 transition-colors'
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors'
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

export default CategoriesProductManagement
