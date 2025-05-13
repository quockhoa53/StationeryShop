import React from 'react'
import { FaInfoCircle, FaCheckCircle, FaHourglassHalf, FaPaperPlane } from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface Request {
  id: number
  date: string
  items: string
  status: 'Đã gửi' | 'Đang xử lý' | 'Hoàn tất'
}

const RequestHistory: React.FC = () => {
  const requests: Request[] = [
    { id: 1, date: '10/03/2025', items: 'Bút bi, Giấy A4', status: 'Hoàn tất' },
    { id: 2, date: '09/03/2025', items: 'Băng keo, Sổ tay', status: 'Đang xử lý' },
    { id: 3, date: '08/03/2025', items: 'Kẹp giấy', status: 'Đã gửi' }
  ]

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Hoàn tất':
        return 'bg-green-100 text-green-700'
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-700'
      case 'Đã gửi':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Hoàn tất':
        return <FaCheckCircle className='mr-1' />
      case 'Đang xử lý':
        return <FaHourglassHalf className='mr-1' />
      case 'Đã gửi':
        return <FaPaperPlane className='mr-1' />
      default:
        return null
    }
  }

  return (
    <div className='bg-white shadow-lg rounded-xl p-6'>
      <h2 className='text-2xl font-bold text-gray-900 mb-4'>Lịch sử yêu cầu</h2>
      {/* Desktop Table */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900'>
            <tr>
              <th className='p-4 text-left font-bold text-sm'>Mã yêu cầu</th>
              <th className='p-4 text-left font-bold text-sm'>Ngày gửi</th>
              <th className='p-4 text-left font-bold text-sm'>Sản phẩm</th>
              <th className='p-4 text-left font-bold text-sm'>Chi tiết</th>
              <th className='p-4 text-left font-bold text-sm'>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr
                key={request.id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-all duration-200 animate-fade-in`}
              >
                <td className='p-4 text-sm font-medium text-gray-800'>{request.id}</td>
                <td className='p-4 text-sm font-medium text-gray-800'>{request.date}</td>
                <td className='p-4 text-sm text-gray-600'>{request.items}</td>
                <td className='p-4'>
                  <Link
                    to={`/department/requests/${request.id}`}
                    className='btn btn-sm btn-outline btn-primary flex items-center space-x-2 hover:scale-105 transition-transform duration-200'
                  >
                    <FaInfoCircle />
                    <span>Chi tiết</span>
                  </Link>
                </td>
                <td className='p-4'>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                      request.status
                    )} shadow-sm`}
                  >
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className='md:hidden space-y-4'>
        {requests.map((request) => (
          <div
            key={request.id}
            className='bg-white shadow-md rounded-lg p-4 hover:bg-blue-50 transition-all duration-200 animate-fade-in'
          >
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm font-bold text-gray-800'>Mã: {request.id}</span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                  request.status
                )} shadow-sm`}
              >
                {getStatusIcon(request.status)}
                {request.status}
              </span>
            </div>
            <p className='text-sm text-gray-600'>
              <strong>Ngày gửi:</strong> {request.date}
            </p>
            <p className='text-sm text-gray-600'>
              <strong>Sản phẩm:</strong> {request.items}
            </p>
            <Link
              to={`/department/requests/${request.id}`}
              className='btn btn-sm btn-outline btn-primary mt-3 flex items-center space-x-2 hover:scale-105 transition-transform duration-200'
            >
              <FaInfoCircle />
              <span>Chi tiết</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RequestHistory
