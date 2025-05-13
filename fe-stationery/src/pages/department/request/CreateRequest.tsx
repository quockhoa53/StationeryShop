import React, { useState } from 'react'
import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa'
import RequestForm from './RequestForm'
import OrderTracking from './OrderTracking'

// Mock data for products with colors and sizes
const mockProducts = [
  { id: 1, name: 'Laptop Dell XPS', colors: ['Silver', 'Black'], sizes: ['13-inch', '15-inch'] },
  { id: 2, name: 'Office Chair', colors: ['Black', 'Blue', 'Red'], sizes: ['Standard', 'Large'] },
  { id: 3, name: 'Desk Lamp', colors: ['White', 'Black'], sizes: ['Small', 'Medium'] }
]

// Mock data for requests with added In Transit status
const mockRequests = [
  {
    id: 1,
    product: 'Laptop Dell XPS',
    color: 'Silver',
    size: '13-inch',
    quantity: 2,
    status: 'Pending',
    date: '2025-05-01'
  },
  {
    id: 2,
    product: 'Office Chair',
    color: 'Black',
    size: 'Standard',
    quantity: 5,
    status: 'Delivered',
    date: '2025-04-28'
  },
  {
    id: 3,
    product: 'Desk Lamp',
    color: 'White',
    size: 'Medium',
    quantity: 3,
    status: 'Cancelled',
    date: '2025-04-25'
  },
  {
    id: 4,
    product: 'Laptop Dell XPS',
    color: 'Black',
    size: '15-inch',
    quantity: 1,
    status: 'In Transit',
    date: '2025-05-03'
  }
]

interface RequestFormData {
  productId: string
  color: string
  size: string
  quantity: number
  notes: string
  priority: string
  deliveryDate: string
}

interface Request {
  id: number
  product: string
  color: string
  size: string
  quantity: number
  status: string
  date: string
}

const CreateRequest: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editRequestId, setEditRequestId] = useState<number | null>(null)
  const [formData, setFormData] = useState<RequestFormData>({
    productId: '',
    color: '',
    size: '',
    quantity: 1,
    notes: '',
    priority: 'normal',
    deliveryDate: ''
  })
  const [productSearch, setProductSearch] = useState('')
  const [requests, setRequests] = useState<Request[]>(mockRequests)
  const [activeTab, setActiveTab] = useState<'delivered' | 'cancelled' | 'inTransit'>('delivered')

  // Filter requests for Pending (main table)
  const pendingRequests = requests.filter((request) => request.status === 'Pending')

  // Handle form submission (create or edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedProduct = mockProducts.find((p) => p.id.toString() === formData.productId)
    if (!selectedProduct) return

    if (isEditMode && editRequestId !== null) {
      // Edit existing request
      setRequests((prev) =>
        prev.map((request) =>
          request.id === editRequestId
            ? {
                ...request,
                product: selectedProduct.name,
                color: formData.color,
                size: formData.size,
                quantity: formData.quantity,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
              }
            : request
        )
      )
    } else {
      // Create new request
      const newRequest: Request = {
        id: requests.length + 1,
        product: selectedProduct.name,
        color: formData.color,
        size: formData.size,
        quantity: formData.quantity,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      }
      setRequests((prev) => [...prev, newRequest])
    }

    setFormData({
      productId: '',
      color: '',
      size: '',
      quantity: 1,
      notes: '',
      priority: 'normal',
      deliveryDate: ''
    })
    setShowForm(false)
    setIsEditMode(false)
    setEditRequestId(null)
    setProductSearch('')
  }

  // Handle edit request
  const handleEdit = (request: Request) => {
    const product = mockProducts.find((p) => p.name === request.product)
    if (product) {
      setFormData({
        productId: product.id.toString(),
        color: request.color,
        size: request.size,
        quantity: request.quantity,
        notes: '',
        priority: 'normal',
        deliveryDate: ''
      })
      setEditRequestId(request.id)
      setIsEditMode(true)
      setShowForm(true)
    }
  }

  // Handle delete request
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa yêu cầu này?')) {
      setRequests((prev) => prev.filter((request) => request.id !== id))
    }
  }

  // Handle form close
  const handleClose = () => {
    setShowForm(false)
    setIsEditMode(false)
    setEditRequestId(null)
    setFormData({
      productId: '',
      color: '',
      size: '',
      quantity: 1,
      notes: '',
      priority: 'normal',
      deliveryDate: ''
    })
    setProductSearch('')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 transition-all duration-300'>
      <div className={`transition-all duration-300 p-10 ml-16 max-w-10xl mx-auto`}>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold text-blue-800 mb-6 ml-1'>Create Request</h1>
          <button
            onClick={() => {
              setShowForm(true)
              setIsEditMode(false)
              setFormData({
                productId: '',
                color: '',
                size: '',
                quantity: 1,
                notes: '',
                priority: 'normal',
                deliveryDate: ''
              })
            }}
            className='flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md'
          >
            <FaPlusCircle size={20} />
            Tạo Yêu Cầu Mới
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <RequestForm
            products={mockProducts}
            formData={formData}
            productSearch={productSearch}
            setFormData={setFormData}
            setProductSearch={setProductSearch}
            onSubmit={handleSubmit}
            onClose={handleClose}
            isEditMode={isEditMode}
          />
        )}

        {/* Pending Requests Table */}
        <div className='bg-white rounded-xl shadow-lg p-8 mt-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Danh Sách Yêu Cầu Chưa Xác Nhận</h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800'>
                  <th className='p-4 text-sm font-semibold'>Sản Phẩm</th>
                  <th className='p-4 text-sm font-semibold'>Màu Sắc</th>
                  <th className='p-4 text-sm font-semibold'>Kích Thước</th>
                  <th className='p-4 text-sm font-semibold'>Số Lượng</th>
                  <th className='p-4 text-sm font-semibold'>Trạng Thái</th>
                  <th className='p-4 text-sm font-semibold'>Ngày Tạo</th>
                  <th className='p-4 text-sm font-semibold'>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request.id} className='border-b hover:bg-blue-50/50 transition'>
                    <td className='p-4 text-sm text-gray-700'>{request.product}</td>
                    <td className='p-4 text-sm text-gray-700'>{request.color}</td>
                    <td className='p-4 text-sm text-gray-700'>{request.size}</td>
                    <td className='p-4 text-sm text-gray-700'>{request.quantity}</td>
                    <td className='p-4 text-sm'>
                      <span className='px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                        {request.status}
                      </span>
                    </td>
                    <td className='p-4 text-sm text-gray-700'>{request.date}</td>
                    <td className='p-4 text-sm flex gap-2'>
                      <button
                        onClick={() => handleEdit(request)}
                        className='bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-500 transition-colors'
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors'
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingRequests.length === 0 && (
              <p className='text-center text-gray-500 mt-4'>Không có yêu cầu nào chưa xác nhận.</p>
            )}
          </div>
        </div>

        {/* Order Tracking Section */}
        <OrderTracking requests={requests} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  )
}

export default CreateRequest
