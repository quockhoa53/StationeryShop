import React from 'react'
import { FaTimes } from 'react-icons/fa'

interface RequestFormProps {
  products: Product[]
  formData: RequestForm
  productSearch: string
  setFormData: React.Dispatch<React.SetStateAction<RequestForm>>
  setProductSearch: React.Dispatch<React.SetStateAction<string>>
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
  isEditMode: boolean
}

interface RequestForm {
  productId: string
  color: string
  size: string
  quantity: number
  notes: string
  priority: string
  deliveryDate: string
}

interface Product {
  id: number
  name: string
  colors: string[]
  sizes: string[]
}

const RequestForm: React.FC<RequestFormProps> = ({
  products,
  formData,
  productSearch,
  setFormData,
  setProductSearch,
  onSubmit,
  onClose,
  isEditMode
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'productId') {
      setFormData((prev) => ({ ...prev, color: '', size: '' }))
    }
  }

  const selectedProduct = products.find((p) => p.id.toString() === formData.productId)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl transform transition-all duration-300 border border-gray-200'>
        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-2xl font-semibold text-gray-800'>{isEditMode ? 'Sửa Yêu Cầu' : 'Tạo Yêu Cầu Mới'}</h2>
          <button onClick={onClose} className='text-gray-500 hover:text-red-500 transition'>
            <FaTimes size={22} />
          </button>
        </div>
        <form onSubmit={onSubmit} className='space-y-5'>
          {/* Product Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Sản Phẩm</label>
            <input
              type='text'
              placeholder='Tìm kiếm sản phẩm...'
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white'
            />
            <select
              name='productId'
              value={formData.productId}
              onChange={handleInputChange}
              className='mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white'
              required
            >
              <option value=''>-- Chọn sản phẩm --</option>
              {filteredProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color and Size Selection */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Màu Sắc</label>
              <select
                name='color'
                value={formData.color}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white'
                required
                disabled={!selectedProduct}
              >
                <option value=''>-- Chọn màu --</option>
                {selectedProduct?.colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Kích Thước</label>
              <select
                name='size'
                value={formData.size}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white'
                required
                disabled={!selectedProduct}
              >
                <option value=''>-- Chọn kích thước --</option>
                {selectedProduct?.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity and Priority */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Số Lượng</label>
              <input
                type='number'
                name='quantity'
                value={formData.quantity}
                onChange={handleInputChange}
                min='1'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white'
                required
              />
            </div>
          </div>

          {/* Delivery Date */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Ngày Giao Hàng</label>
            <input
              type='date'
              name='deliveryDate'
              value={formData.deliveryDate}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white'
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Ghi Chú</label>
            <textarea
              name='notes'
              value={formData.notes}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white'
              rows={3}
              placeholder='Ghi chú thêm nếu có...'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-3 pt-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm font-medium'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium'
            >
              {isEditMode ? 'Cập Nhật' : 'Gửi Yêu Cầu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestForm
