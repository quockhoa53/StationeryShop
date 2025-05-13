import React, { useState } from 'react'
import { FaUpload, FaEdit, FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { ProductDetail, FetchColor } from '~/types/product'

interface ProductDetailForm {
  colorId: string
  colorName: string
  colorCode: string
  size: string
  images: string[]
  quantity: number
  sold: number
  discountPrice: number
  totalRating: number
}

interface AddProductDetailsFormProps {
  productDetails: ProductDetail[]
  fetchColors: FetchColor[]
  onAddDetail: (detail: ProductDetail) => void
  onUpdateDetail: (detail: ProductDetail) => void
  onDeleteDetail: (detailId: string) => void
  onFinish: () => void
  onCancel: () => void
}

const AddProductDetailsForm: React.FC<AddProductDetailsFormProps> = ({
  productDetails,
  fetchColors,
  onAddDetail,
  onUpdateDetail,
  onDeleteDetail,
  onFinish,
  onCancel
}) => {
  const [currentDetail, setCurrentDetail] = useState<ProductDetailForm>({
    colorId: '',
    colorName: '',
    colorCode: '#000000',
    size: '',
    images: ['', '', '', '', ''],
    quantity: 0,
    sold: 0,
    discountPrice: 0,
    totalRating: 0
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingDetailId, setEditingDetailId] = useState<string | null>(null)

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentDetail((prev) => {
      if (name === 'colorId') {
        const selectedColor = fetchColors.find((fc) => fc.colorId === value)
        return {
          ...prev,
          colorId: value,
          colorName: selectedColor ? selectedColor.slug.replace('color-', '').replace(/-/g, ' ') : prev.colorName,
          colorCode: selectedColor ? selectedColor.hex : prev.colorCode
        }
      }
      return {
        ...prev,
        [name]:
          name === 'quantity' || name === 'sold' || name === 'discountPrice' || name === 'totalRating'
            ? parseFloat(value) || 0
            : value
      }
    })
  }

  const handleDetailImageChange = (index: number, file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImages = [...currentDetail.images]
        newImages[index] = e.target?.result as string
        setCurrentDetail((prev) => ({ ...prev, images: newImages }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddOrUpdateDetail = () => {
    if (
      !currentDetail.colorName ||
      !currentDetail.size ||
      currentDetail.quantity < 0 ||
      currentDetail.discountPrice <= 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields and ensure quantity and price are valid.'
      })
      return
    }

    const selectedColor = fetchColors.find((fc) => fc.colorId === currentDetail.colorId) || {
      colorId: `c${Date.now()}`,
      hex: currentDetail.colorCode,
      slug: `color-${currentDetail.colorName.toLowerCase().replace(/\s/g, '-')}`
    }

    const detail: ProductDetail = {
      productDetailId: isEditing && editingDetailId ? editingDetailId : `pd${Date.now()}`,
      name: currentDetail.colorName,
      slug: `detail-${currentDetail.colorName.toLowerCase().replace(/\s/g, '-')}`,
      originalPrice: currentDetail.discountPrice,
      stockQuantity: currentDetail.quantity,
      soldQuantity: currentDetail.sold,
      discountPrice: currentDetail.discountPrice,
      size: { sizeId: `s${Date.now()}`, name: currentDetail.size, priority: 0 },
      color: {
        colorId: selectedColor.colorId,
        name: currentDetail.colorName,
        hex: currentDetail.colorCode
      },
      totalRating: currentDetail.totalRating,
      description: '',
      promotion: null,
      images: currentDetail.images
        .filter((img) => img !== '')
        .map((url, index) => ({ imageId: `img${index + 1}`, url, priority: index + 1 })),
      productId: '',
      createdAt: new Date().toISOString()
    }

    if (isEditing) {
      onUpdateDetail(detail)
      setIsEditing(false)
      setEditingDetailId(null)
    } else {
      onAddDetail(detail)
    }

    setCurrentDetail({
      colorId: '',
      colorName: '',
      colorCode: '#000000',
      size: '',
      images: ['', '', '', '', ''],
      quantity: 0,
      sold: 0,
      discountPrice: 0,
      totalRating: 0
    })
  }

  const handleEditDetail = (detail: ProductDetail) => {
    setCurrentDetail({
      colorId: detail.color.colorId,
      colorName: detail.color.name,
      colorCode: detail.color.hex,
      size: detail.size.name,
      images: (detail.images ?? []).map((img) => img.url).concat(Array(5 - (detail.images?.length || 0)).fill('')),
      quantity: detail.stockQuantity,
      sold: detail.soldQuantity,
      discountPrice: detail.discountPrice,
      totalRating: detail.totalRating
    })
    setIsEditing(true)
    setEditingDetailId(detail.productDetailId)
  }

  const handleDelete = (detailId: string) => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn chắc chắn muốn xóa chi tiết sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteDetail(detailId)
        Swal.fire('Đã xóa!', 'Chi tiết sản phẩm đã được xóa.', 'success')
        if (isEditing && editingDetailId === detailId) {
          setCurrentDetail({
            colorId: '',
            colorName: '',
            colorCode: '#000000',
            size: '',
            images: ['', '', '', '', ''],
            quantity: 0,
            sold: 0,
            discountPrice: 0,
            totalRating: 0
          })
          setIsEditing(false)
          setEditingDetailId(null)
        }
      }
    })
  }

  return (
    <div className='mb-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100'>
      <h2 className='text-2xl font-bold text-blue-700 mb-6'>Add Product Details</h2>

      {/* Added Details Table */}
      <div className='mb-8'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>Added Details</h3>
        {productDetails.length === 0 ? (
          <p className='text-gray-500 italic'>No details added yet.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-blue-100 text-blue-800 text-sm uppercase'>
                  <th className='px-4 py-3 text-left'>Color</th>
                  <th className='px-4 py-3 text-left'>Size</th>
                  <th className='px-4 py-3 text-left'>Quantity</th>
                  <th className='px-4 py-3 text-left'>Price</th>
                  <th className='px-4 py-3 text-left'>Images</th>
                  <th className='px-4 py-3 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {productDetails.map((detail) => (
                  <tr key={detail.productDetailId} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-4 py-3 text-sm'>
                      <div className='flex items-center gap-2'>
                        <span
                          className='w-5 h-5 rounded-full inline-block'
                          style={{ backgroundColor: detail.color.hex }}
                        />
                        {detail.color.name}
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm'>{detail.size.name}</td>
                    <td className='px-4 py-3 text-sm'>{detail.stockQuantity.toLocaleString('vi-VN')}</td>
                    <td className='px-4 py-3 text-sm'>{detail.discountPrice.toLocaleString('vi-VN')} VND</td>
                    <td className='px-4 py-3 text-sm'>
                      <div className='flex gap-2'>
                        {detail.images
                          ?.slice(0, 3)
                          .map((img, idx) => (
                            <img
                              key={idx}
                              src={img.url}
                              alt={`Detail-${idx}`}
                              className='w-8 h-8 rounded object-cover'
                            />
                          ))}
                        {detail.images && detail.images.length > 3 && (
                          <span className='text-gray-500'>+{detail.images.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleEditDetail(detail)}
                          className='p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors'
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(detail.productDetailId)}
                          className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Form */}
      <div className='p-6 bg-gray-50 rounded-xl border border-gray-200'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>{isEditing ? 'Edit Detail' : 'Add New Detail'}</h3>
        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Color <span className='text-red-500'>*</span>
            </label>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>Select Color</label>
                <select
                  name='colorId'
                  value={currentDetail.colorId}
                  onChange={handleDetailChange}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors'
                >
                  <option value=''>Add new color</option>
                  {fetchColors.map((color) => (
                    <option key={color.colorId} value={color.colorId}>
                      {color.slug.replace('color-', '').replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>Color Code</label>
                <input
                  type='color'
                  name='colorCode'
                  value={currentDetail.colorCode}
                  onChange={handleDetailChange}
                  className='w-full h-10 p-1 border border-gray-200 rounded-lg cursor-pointer'
                  disabled={!!currentDetail.colorId}
                />
              </div>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>Color Name</label>
                <input
                  type='text'
                  name='colorName'
                  value={currentDetail.colorName}
                  onChange={handleDetailChange}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors'
                  placeholder='e.g. Red, Blue'
                  disabled={!!currentDetail.colorId}
                />
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Size <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='size'
                value={currentDetail.size}
                onChange={handleDetailChange}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors'
                placeholder='Enter size'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Quantity <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                name='quantity'
                value={currentDetail.quantity}
                onChange={handleDetailChange}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors'
                placeholder='Enter quantity'
                min='0'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Sold Quantity</label>
              <input
                type='number'
                name='sold'
                value={currentDetail.sold}
                onChange={handleDetailChange}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors'
                placeholder='Enter sold quantity'
                min='0'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Price <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                name='discountPrice'
                value={currentDetail.discountPrice}
                onChange={handleDetailChange}
                className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors'
                placeholder='Enter price'
                min='0'
                step='0.01'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Image Gallery</label>
            <div className='grid grid-cols-5 gap-3'>
              {currentDetail.images.map((img, index) => (
                <div
                  key={index}
                  className='relative h-24 border border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-100'
                >
                  {img ? (
                    <img src={img} alt={`Preview ${index + 1}`} className='w-full h-full object-cover' />
                  ) : (
                    <span className='text-gray-400 text-xs text-center'>Image {index + 1}</span>
                  )}
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleDetailImageChange(index, e.target.files?.[0] || null)}
                    className='absolute inset-0 opacity-0 cursor-pointer'
                  />
                  <div className='absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors'>
                    <FaUpload className='text-xs' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='flex gap-4 mt-6'>
          <button
            onClick={handleAddOrUpdateDetail}
            className={`px-5 py-2.5 text-white rounded-lg transition-colors text-sm font-medium ${
              isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Update Detail' : 'Add Detail'}
          </button>
          <button
            onClick={onFinish}
            className='px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'
          >
            Next
          </button>
          <button
            onClick={onCancel}
            className='px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddProductDetailsForm
