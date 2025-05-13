import React from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { departmentPath } from '~/constance/paths'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

const PopularProducts: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'Bút bi Thiên Long',
      price: 5000,
      image:
        'https://images.unsplash.com/photo-1589811676882-a86dd26e3913?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 2,
      name: 'Giấy A4 Double A',
      price: 60000,
      image:
        'https://images.unsplash.com/photo-1589811676882-a86dd26e3913?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 3,
      name: 'Sổ tay Campus',
      price: 25000,
      image:
        'https://images.unsplash.com/photo-1589811676882-a86dd26e3913?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ]

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>Sản phẩm phổ biến</h2>
        <Link to={departmentPath.PRODUCT} className='text-blue-600 hover:underline text-sm font-medium'>
          Xem tất cả
        </Link>
      </div>
      <div className='grid grid-cols-1 gap-4'>
        {products.map((product) => (
          <div
            key={product.id}
            className='flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
          >
            <img src={product.image} alt={product.name} className='w-16 h-16 object-cover rounded-md mr-4' />
            <div className='flex-1'>
              <h3 className='text-sm font-semibold text-gray-800'>{product.name}</h3>
              <p className='text-sm text-gray-600'>{product.price.toLocaleString()} VND</p>
            </div>
            <Link
              to={`${departmentPath.CREATE_REQUEST}?productId=${product.id}`}
              className='btn btn-sm btn-primary flex items-center'
            >
              <FaPlusCircle className='mr-1' />
              Thêm
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PopularProducts
