import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { Category } from '~/types/category'
import { ListProductDetail } from '~/types/product'

// Dữ liệu mẫu categories
const defaultCategories: Category[] = [
  { categoryId: '1', categoryName: 'Electronics' },
  { categoryId: '2', categoryName: 'Clothing' },
  { categoryId: '3', categoryName: 'Home & Garden' },
  { categoryId: '4', categoryName: 'Books' },
  { categoryId: '5', categoryName: 'Sports' }
]

interface AddProductFormProps {
  initialProduct?: Partial<ListProductDetail>
  categories?: Category[]
  onSubmit: (product: Partial<ListProductDetail>) => void
  onCancel: () => void
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  initialProduct = {},
  categories = defaultCategories,
  onSubmit,
  onCancel
}) => {
  const [product, setProduct] = useState<Partial<ListProductDetail>>({
    name: '',
    description: '',
    slug: '',
    category: { categoryId: '', categoryName: '' },
    minPrice: 0,
    productDetails: [],
    fetchColor: [],
    ...initialProduct
  })

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'categoryId') {
      const selectedCategory = categories.find((cat) => cat.categoryId === value)
      setProduct((prev) => ({
        ...prev,
        category: {
          categoryId: value,
          categoryName: selectedCategory?.categoryName || ''
        }
      }))
    } else if (name === 'minPrice') {
      setProduct((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }))
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Xử lý submit form
  const handleSubmit = () => {
    // Validation
    if (!product.name || !product.slug || !product.category?.categoryId) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng điền đầy đủ các trường bắt buộc (Name, Slug, Category, Price).'
      })
      return
    }

    // Gửi dữ liệu về parent
    onSubmit(product)
  }

  // Xử lý cancel
  const handleCancel = () => {
    setProduct({
      name: '',
      description: '',
      slug: '',
      category: { categoryId: '', categoryName: '' },
      minPrice: 0,
      productDetails: [],
      fetchColor: []
    })
    onCancel()
  }

  return (
    <div className='mb-8 p-8 rounded-3xl shadow-xl border border-blue-200 transition-all'>
      <h2 className='text-3xl font-bold text-blue-800 mb-6 text-center'>Add New Product</h2>

      <div className='space-y-4'>
        {/* Form Fields */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>
            Name <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='name'
            value={product.name || ''}
            onChange={handleChange}
            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
            placeholder='Enter product name'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>
            Slug <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='slug'
            value={product.slug || ''}
            onChange={handleChange}
            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
            placeholder='Enter product slug'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>
            Category <span className='text-red-500'>*</span>
          </label>
          <select
            name='categoryId'
            value={product.category?.categoryId || ''}
            onChange={handleChange}
            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
            required
          >
            <option value='' disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>Description</label>
          <input
            type='text'
            name='description'
            value={product.description || ''}
            onChange={handleChange}
            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
            placeholder='Enter product description'
          />
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>
            Price <span className='text-red-500'>*</span>
          </label>
          <input
            type='number'
            name='minPrice'
            value={product.minPrice || 0}
            onChange={handleChange}
            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
            placeholder='Enter price'
            min='0'
            step='0.01'
            required
          />
        </div>
      </div>

      {/* Buttons */}
      <div className='flex justify-end gap-4 mt-10'>
        <button
          onClick={handleCancel}
          className='px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium'
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className='px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition text-sm font-semibold shadow-md'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default AddProductForm
