import React from 'react'
import { FaPaperPlane, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa'

const OrderOverview: React.FC = () => {
  const stats = [
    { title: 'Yêu cầu đã gửi', value: 12, icon: <FaPaperPlane />, color: 'd-bg-primary' },
    { title: 'Đang xử lý', value: 5, icon: <FaHourglassHalf />, color: 'd-bg-warning' },
    { title: 'Đã nhận', value: 8, icon: <FaCheckCircle />, color: 'd-bg-success' }
  ]

  return (
    <div className='d-card d-bg-base-100 d-shadow-xl p-6'>
      <h2 className='text-xl font-semibold text-base-content mb-4'>Tổng quan đơn hàng</h2>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} bg-blue-200 rounded-md d-text-white p-4 d-rounded-lg flex items-center justify-between d-transition-transform hover:scale-105`}
          >
            <div>
              <p className='text-sm'>{stat.title}</p>
              <p className='text-2xl font-bold'>{stat.value}</p>
            </div>
            <div className='text-3xl'>{stat.icon}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderOverview
