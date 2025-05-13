import React, { useState } from 'react'
import Swal from 'sweetalert2'
import Select from 'react-select'
import { ListProductDetail } from '~/types/product'
import { categoryOptions } from '~/constance/seed/option'
import { Pencil } from 'lucide-react'

interface EditProductModalProps {
  isOpen: boolean
  product: ListProductDetail
  onClose: () => void
  onSave: (updatedProduct: ListProductDetail) => void
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    category: categoryOptions.find((opt) => opt.categoryId === product.category.categoryId) || null,
    img: product.img
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!formData.name || !formData.slug || !formData.category) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error')
      return
    }

    const updatedProduct: ListProductDetail = {
      ...product,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      category: {
        categoryId: formData.category.categoryId,
        categoryName: formData.category.value
      },
      img: imageFile ? URL.createObjectURL(imageFile) : formData.img
    }

    onSave(updatedProduct)
    onClose()
    Swal.fire('Success', 'Product updated successfully!', 'success')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl'>
        <div className='sticky top-0 bg-gradient-to-r from-blue-700 to-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center mb-4'>
          <h2 className='text-3xl font-bold'>Edit Product</h2>
          <button
            onClick={onClose}
            className='bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
          >
            ✕
          </button>
        </div>
        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Name *</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Slug *</label>
            <input
              type='text'
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className='mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Category *</label>
            <Select
              options={categoryOptions}
              value={formData.category}
              onChange={(option) => setFormData({ ...formData, category: option || null })}
              className='mt-1'
              classNamePrefix='select'
              isClearable
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className='mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300'
              rows={4}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Image</label>
            <div className='relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden'>
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : formData.img}
                alt='Product'
                className='w-full h-full object-cover rounded-xl'
              />
              <label className='absolute bottom-1 right-1 bg-white p-1 rounded-full cursor-pointer shadow-md hover:bg-gray-100 transition'>
                <Pencil className='w-5 h-5 text-gray-600' />
                <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
              </label>
            </div>
          </div>
        </div>

        <div className='mt-8 flex justify-end gap-4'>
          <button
            onClick={onClose}
            className='px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className='px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProductModal
