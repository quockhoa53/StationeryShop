import React, { useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'

interface Request {
  id: number
  product: string
  color: string
  size: string
  quantity: number
  status: string
  date: string
  cancelledBy?: string
  cancelReason?: string
}

interface OrderTrackingProps {
  requests: Request[]
  activeTab: 'delivered' | 'cancelled' | 'inTransit'
  setActiveTab: React.Dispatch<React.SetStateAction<'delivered' | 'cancelled' | 'inTransit'>>
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ requests, activeTab, setActiveTab }) => {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  // Filter requests for tabs (Delivered/Cancelled/InTransit)
  const deliveredRequests = requests.filter((request) => request.status === 'Delivered')
  const cancelledRequests = requests.filter((request) => request.status === 'Cancelled')
  const inTransitRequests = requests.filter((request) => request.status === 'In Transit')

  // Handle view cancellation details
  const handleViewCancelDetails = (request: Request) => {
    setSelectedRequest(request)
    setShowCancelModal(true)
  }

  // Close cancellation details modal
  const handleCloseModal = () => {
    setShowCancelModal(false)
    setSelectedRequest(null)
  }

  return (
    <div className='bg-white rounded-xl shadow-lg p-8 mt-8'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Theo Dõi Đơn Hàng</h2>
      <div className='flex border-b border-gray-200 mb-6'>
        <button
          onClick={() => setActiveTab('delivered')}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === 'delivered' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Đã Giao
        </button>
        <button
          onClick={() => setActiveTab('inTransit')}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === 'inTransit' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Đang Giao
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === 'cancelled' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Đã Hủy
        </button>
      </div>
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
              {activeTab === 'cancelled' && <th className='p-4 text-sm font-semibold'>Chi Tiết Hủy</th>}
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'delivered'
              ? deliveredRequests
              : activeTab === 'inTransit'
                ? inTransitRequests
                : cancelledRequests
            ).map((request) => (
              <tr key={request.id} className='border-b hover:bg-blue-50/50 transition'>
                <td className='p-4 text-sm text-gray-700'>{request.product}</td>
                <td className='p-4 text-sm text-gray-700'>{request.color}</td>
                <td className='p-4 text-sm text-gray-700'>{request.size}</td>
                <td className='p-4 text-sm text-gray-700'>{request.quantity}</td>
                <td className='p-4 text-sm'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className='p-4 text-sm text-gray-700'>{request.date}</td>
                {activeTab === 'cancelled' && (
                  <td className='p-4 text-sm'>
                    <button
                      onClick={() => handleViewCancelDetails(request)}
                      className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors'
                    >
                      <FaInfoCircle size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {(activeTab === 'delivered'
          ? deliveredRequests
          : activeTab === 'inTransit'
            ? inTransitRequests
            : cancelledRequests
        ).length === 0 && (
          <p className='text-center text-gray-500 mt-4'>
            Không có đơn hàng{' '}
            {activeTab === 'delivered' ? 'đã giao' : activeTab === 'inTransit' ? 'đang giao' : 'đã hủy'}.
          </p>
        )}
      </div>

      {/* Cancellation Details Modal */}
      {showCancelModal && selectedRequest && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold text-gray-900'>Chi Tiết Hủy Đơn Hàng</h2>
              <button onClick={handleCloseModal} className='text-gray-400 hover:text-gray-600 transition'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Sản Phẩm</label>
                <p className='text-sm text-gray-900'>{selectedRequest.product}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Người Hủy</label>
                <p className='text-sm text-gray-900'>{selectedRequest.cancelledBy || 'Không xác định'}</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Lý Do Hủy</label>
                <p className='text-sm text-gray-900'>{selectedRequest.cancelReason || 'Không có lý do'}</p>
              </div>
            </div>
            <div className='flex justify-end mt-6'>
              <button
                onClick={handleCloseModal}
                className='px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition text-sm font-medium'
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTracking
