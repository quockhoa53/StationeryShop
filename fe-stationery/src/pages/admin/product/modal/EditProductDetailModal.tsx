import React, { useState } from 'react'
import Swal from 'sweetalert2'
import Select from 'react-select'
import { ProductDetail } from '~/types/product'
import { colorOptions, sizeOptions } from '~/constance/seed/option'

interface EditProductDetailModalProps {
  isOpen: boolean
  productId: string
  detail: ProductDetail
  onClose: () => void
  onSave: (pId: string, updatedDetail: ProductDetail) => void
}

const EditProductDetailModal: React.FC<EditProductDetailModalProps> = ({
  isOpen,
  productId,
  detail,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    color: detail.color ? colorOptions.find((opt) => opt.colorId === detail.color?.colorId) : null,
    size: detail.size ? sizeOptions.find((opt) => opt.sizeId === detail.size?.sizeId) : null,
    stockQuantity: detail.stockQuantity,
    discountPrice: detail.discountPrice,
    images: detail.images || []
  })
  const [newImages, setNewImages] = useState<File[]>([])

  if (!isOpen) return null

  const hasColors = !!detail.color
  const hasSizes = !!detail.size

  const handleSubmit = () => {
    if (hasColors && !formData.color) {
      Swal.fire('Error', 'Please select a color.', 'error')
      return
    }
    if (hasSizes && !formData.size) {
      Swal.fire('Error', 'Please select a size.', 'error')
      return
    }
    if (formData.stockQuantity < 0 || formData.discountPrice <= 0) {
      Swal.fire('Error', 'Invalid quantity or price.', 'error')
      return
    }

    const updatedDetail: ProductDetail = {
      ...detail,
      color: formData.color
        ? { colorId: formData.color.colorId, name: formData.color.value, hex: formData.color.hex }
        : null,
      size: formData.size
        ? { sizeId: formData.size.sizeId, name: formData.size.value, priority: formData.size.priority }
        : null,
      stockQuantity: formData.stockQuantity,
      discountPrice: formData.discountPrice,
      images: [
        ...formData.images,
        ...newImages.map((file, idx) => ({
          imageId: `new-${idx}`,
          url: URL.createObjectURL(file),
          priority: formData.images.length + idx + 1
        }))
      ]
    }
    onSave(productId, updatedDetail)
    onClose()
    Swal.fire('Success', 'Product detail updated successfully!', 'success')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)])
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index))
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Edit Product Detail</h2>
        <div className='space-y-4'>
          {hasColors && (
            <div>
              <label className='block text-sm font-medium text-gray-700'>Color *</label>
              <Select
                options={colorOptions}
                value={formData.color}
                onChange={(option) => setFormData({ ...formData, color: option })}
                className='mt-1'
                classNamePrefix='select'
                isClearable
              />
            </div>
          )}
          {hasSizes && (
            <div>
              <label className='block text-sm font-medium text-gray-700'>Size *</label>
              <Select
                options={sizeOptions}
                value={formData.size}
                onChange={(option) => setFormData({ ...formData, size: option })}
                className='mt-1'
                classNamePrefix='select'
                isClearable
              />
            </div>
          )}
          <div>
            <label className='block text-sm font-medium text-gray-700'>Stock Quantity *</label>
            <input
              type='number'
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
              className='mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300'
              min='0'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Discount Price (VND) *</label>
            <input
              type='number'
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
              className='mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300'
              min='0'
              required
            />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Images</label>
          <div className='mt-2 grid grid-cols-5 gap-3'>
            {[
              ...formData.images,
              ...newImages.map((file, i) => ({
                imageId: `new-${i}`,
                url: URL.createObjectURL(file)
              }))
            ]
              .slice(0, 5)
              .map((img, idx) => (
                <div key={img.imageId} className='relative w-32 h-32 border rounded-xl overflow-hidden shadow-sm'>
                  <img src={img.url} alt={`Image-${idx}`} className='w-full h-full object-cover' />
                  {/* Xóa ảnh */}
                  <button
                    onClick={() => {
                      if (img.imageId.startsWith('new-')) {
                        removeNewImage(idx - formData.images.length)
                      } else {
                        removeImage(idx)
                      }
                    }}
                    className='absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700'
                    title='Remove image'
                  >
                    ✕
                  </button>
                  {/* Đổi ảnh */}
                  <label className='absolute bottom-1 right-1 bg-white bg-opacity-80 p-1 rounded-full cursor-pointer shadow'>
                    📷
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const newFile = e.target.files[0]
                          if (img.imageId.startsWith('new-')) {
                            const updatedNewImages = [...newImages]
                            updatedNewImages[idx - formData.images.length] = newFile
                            setNewImages(updatedNewImages)
                          } else {
                            const updatedImages = [...formData.images]
                            updatedImages[idx] = {
                              ...updatedImages[idx],
                              url: URL.createObjectURL(newFile)
                            }
                            setFormData({ ...formData, images: updatedImages })
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              ))}
            {/* Thêm khung trống nếu chưa đủ 5 ảnh */}
            {Array.from({ length: Math.max(0, 5 - formData.images.length - newImages.length) }).map((_, i) => (
              <label
                key={`empty-${i}`}
                className='w-32 h-32 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer text-gray-400 hover:border-blue-500 hover:text-blue-500 transition'
              >
                📷
                <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
              </label>
            ))}
          </div>
        </div>

        <div className='mt-6 flex justify-end gap-4'>
          <button onClick={onClose} className='px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400'>
            Cancel
          </button>
          <button onClick={handleSubmit} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProductDetailModal
