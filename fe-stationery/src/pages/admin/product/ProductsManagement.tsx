import { useState } from 'react'
import Swal from 'sweetalert2'
import ProgressBar from './component/ProgressBar'
import AddProductForm from './addproduct/AddProductForm'
import AddProductDetailsForm from './addproduct/AddProductDetailsForm'
import ConfirmProductForm from './addproduct/ConfirmProductForm'
import ProductList from './component/ProductList'
import { FaPlus } from 'react-icons/fa'
import { ListProductDetail, ProductDetail } from '~/types/product'
import { mockProducts } from '~/constance/seed/mockProducts'

function ProductsManagement() {
  const [products, setProducts] = useState<ListProductDetail[]>(mockProducts)
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const [newProduct, setNewProduct] = useState<ListProductDetail>({
    productId: '',
    name: '',
    description: '',
    slug: '',
    category: { categoryId: '', categoryName: '' },
    minPrice: 0,
    quantity: 0,
    soldQuantity: 0,
    totalRating: 0,
    createdAt: new Date().toISOString(),
    productDetails: [],
    fetchColor: [],
    img: ''
  })

  const resetProcess = () => {
    setStep(0)
    setNewProduct({
      productId: '',
      name: '',
      description: '',
      slug: '',
      category: { categoryId: '', categoryName: '' },
      minPrice: 0,
      quantity: 0,
      soldQuantity: 0,
      totalRating: 0,
      createdAt: new Date().toISOString(),
      productDetail: [],
      fetchColor: [],
      img: ''
    })
  }

  const deleteProduct = async (id: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn chắc chắn muốn xóa sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })

    if (result.isConfirmed) {
      setProducts((prev) => prev.filter((p) => p.productId !== id))
      Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa.', 'success')
    }
  }

  const deleteProductDetail = async (pId: string, detailId: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn chắc chắn muốn xóa chi tiết sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    })

    if (result.isConfirmed) {
      setProducts((prev) =>
        prev.map((p) =>
          p.productId === pId
            ? {
                ...p,
                productDetails: p.productDetails.filter((detail: ProductDetail) => detail.productDetailId !== detailId),
                fetchColor: [
                  ...new Set(
                    p.productDetail
                      .filter((detail: ProductDetail) => detail.productDetailId !== detailId)
                      .map((detail) => ({
                        colorId: detail.color.colorId,
                        hex: detail.color.hex,
                        slug: `color-${detail.color.name.toLowerCase().replace(/\s/g, '-')}`
                      }))
                  )
                ],
                minPrice:
                  p.productDetails.length > 1
                    ? Math.min(
                        ...p.productDetails
                          .filter((detail) => detail.productDetailId !== detailId)
                          .map((d: ProductDetail) => d.discountPrice)
                      )
                    : 0,
                quantity: p.productDetail
                  .filter((detail) => detail.productDetailId !== detailId)
                  .reduce((sum: number, d: ProductDetail) => sum + d.stockQuantity, 0),
                soldQuantity: p.productDetail
                  .filter((detail) => detail.productDetailId !== detailId)
                  .reduce((sum: number, d: ProductDetail) => sum + d.soldQuantity, 0),
                totalRating:
                  p.productDetail.length > 1
                    ? p.productDetail
                        .filter((detail) => detail.productDetailId !== detailId)
                        .reduce((sum: number, d: ProductDetail) => sum + d.totalRating, 0) /
                      p.productDetail.filter((detail) => detail.productDetailId !== detailId).length
                    : 0
              }
            : p
        )
      )
      Swal.fire('Đã xóa!', 'Chi tiết sản phẩm đã được xóa.', 'success')
    }
  }

  const handleConfirm = () => {
    const finalProduct: ListProductDetail = {
      ...newProduct,
      productId: `p${products.length + 1}`,
      productDetails: newProduct.productDetails.map((detail) => ({
        ...detail,
        productId: `p${products.length + 1}`
      })),
      img: newProduct.productDetails[0]?.images?.[0]?.url || ''
    }
    setProducts((prev) => [...prev, finalProduct])
    Swal.fire('Thành công!', 'Sản phẩm đã được thêm.', 'success')
    resetProcess()
  }

  const checkDuplicateDetail = (detail: ProductDetail, details: ProductDetail[]) => {
    return details.some(
      (d) =>
        d.productDetailId !== detail.productDetailId &&
        d.color.colorId === detail.color.colorId &&
        d.size.name === detail.size.name
    )
  }
  return (
    <div className='p-6 w-full mx-auto bg-white shadow-lg rounded-xl'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold text-blue-800'>Products Management</h1>
        {step === 0 && (
          <button
            onClick={() => setStep(1)}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors'
          >
            <FaPlus size={16} />
            Add New Product
          </button>
        )}
      </div>

      {step > 0 && <ProgressBar step={step} />}

      {step === 1 && (
        <AddProductForm
          initialProduct={newProduct}
          onSubmit={(product) => {
            setNewProduct((prev) => ({ ...prev, ...product }))
            setStep(2)
          }}
          onCancel={resetProcess}
        />
      )}

      {step === 2 && (
        <AddProductDetailsForm
          productDetails={newProduct.productDetails}
          fetchColors={newProduct.fetchColor}
          onAddDetail={(detail) => {
            setNewProduct((prev) => {
              // Kiểm tra trùng lặp
              if (checkDuplicateDetail(detail, prev.productDetails)) {
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Chi tiết sản phẩm với màu và kích thước này đã tồn tại.'
                })
                return prev
              }

              // Tìm màu sắc trong fetchColor
              const existingColor = prev.fetchColor.find(
                (fc) =>
                  fc.hex === detail.color.hex &&
                  fc.slug === `color-${detail.color.name.toLowerCase().replace(/\s/g, '-')}`
              )

              const newDetailWithColorId = {
                ...detail,
                color: {
                  ...detail.color,
                  colorId: existingColor ? existingColor.colorId : detail.color.colorId
                }
              }

              const newDetails = [...prev.productDetails, newDetailWithColorId]
              const newFetchColor = existingColor
                ? prev.fetchColor
                : [
                    ...prev.fetchColor,
                    {
                      colorId: detail.color.colorId,
                      hex: detail.color.hex,
                      slug: `color-${detail.color.name.toLowerCase().replace(/\s/g, '-')}`
                    }
                  ]

              return {
                ...prev,
                productDetail: newDetails,
                fetchColor: newFetchColor,
                minPrice: newDetails.length > 0 ? Math.min(...newDetails.map((d) => d.discountPrice)) : 0,
                quantity: newDetails.reduce((sum, d) => sum + d.stockQuantity, 0),
                soldQuantity: newDetails.reduce((sum, d) => sum + d.soldQuantity, 0),
                totalRating:
                  newDetails.length > 0 ? newDetails.reduce((sum, d) => sum + d.totalRating, 0) / newDetails.length : 0,
                img: newDetails[0]?.images?.[0]?.url || prev.img
              }
            })
          }}
          onUpdateDetail={(detail) => {
            setNewProduct((prev) => {
              // Kiểm tra trùng lặp
              if (checkDuplicateDetail(detail, prev.productDetails)) {
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Chi tiết sản phẩm với màu và kích thước này đã tồn tại.'
                })
                return prev
              }

              // Tìm màu sắc trong fetchColor
              const existingColor = prev.fetchColor.find(
                (fc) =>
                  fc.hex === detail.color.hex &&
                  fc.slug === `color-${detail.color.name.toLowerCase().replace(/\s/g, '-')}`
              )

              const newDetailWithColorId = {
                ...detail,
                color: {
                  ...detail.color,
                  colorId: existingColor ? existingColor.colorId : detail.color.colorId
                }
              }

              const newDetails = prev.productDetails.map((d) =>
                d.productDetailId === detail.productDetailId ? newDetailWithColorId : d
              )

              // Cập nhật fetchColor nếu màu mới
              const newFetchColor = existingColor
                ? prev.fetchColor
                : [
                    ...prev.fetchColor,
                    {
                      colorId: detail.color.colorId,
                      hex: detail.color.hex,
                      slug: `color-${detail.color.name.toLowerCase().replace(/\s/g, '-')}`
                    }
                  ]

              return {
                ...prev,
                productDetail: newDetails,
                fetchColor: newFetchColor,
                minPrice: newDetails.length > 0 ? Math.min(...newDetails.map((d) => d.discountPrice)) : 0,
                quantity: newDetails.reduce((sum, d) => sum + d.stockQuantity, 0),
                soldQuantity: newDetails.reduce((sum, d) => sum + d.soldQuantity, 0),
                totalRating:
                  newDetails.length > 0 ? newDetails.reduce((sum, d) => sum + d.totalRating, 0) / newDetails.length : 0,
                img: newDetails[0]?.images?.[0]?.url || prev.img
              }
            })
          }}
          onDeleteDetail={(detailId) => {
            setNewProduct((prev) => {
              const newDetails = prev.productDetails.filter((d) => d.productDetailId !== detailId)
              // Chỉ giữ lại các màu sắc còn được sử dụng trong productDetail
              const usedColorIds = new Set(newDetails.map((d) => d.color.colorId))
              const newFetchColor = prev.fetchColor.filter((fc) => usedColorIds.has(fc.colorId))

              return {
                ...prev,
                productDetail: newDetails,
                fetchColor: newFetchColor,
                minPrice: newDetails.length > 0 ? Math.min(...newDetails.map((d) => d.discountPrice)) : 0,
                quantity: newDetails.reduce((sum, d) => sum + d.stockQuantity, 0),
                soldQuantity: newDetails.reduce((sum, d) => sum + d.soldQuantity, 0),
                totalRating:
                  newDetails.length > 0 ? newDetails.reduce((sum, d) => sum + d.totalRating, 0) / newDetails.length : 0,
                img: newDetails[0]?.images?.[0]?.url || ''
              }
            })
          }}
          onFinish={() => {
            if (newProduct.productDetails.length === 0) {
              Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng thêm ít nhất một chi tiết sản phẩm trước khi tiếp tục.'
              })
              return
            }
            setStep(3)
          }}
          onCancel={resetProcess}
        />
      )}

      {step === 3 && (
        <ConfirmProductForm
          product={newProduct}
          productDetails={newProduct.productDetails}
          fetchColors={newProduct.fetchColor}
          onConfirm={handleConfirm}
          onBack={() => setStep(2)}
          onCancel={resetProcess}
        />
      )}

      {step === 0 && (
        <ProductList
          onDeleteProduct={deleteProduct}
          onDeleteProductDetail={deleteProductDetail}
          onEditProduct={(updatedProduct) => {
            setProducts(products.map((p) => (p.productId === updatedProduct.productId ? updatedProduct : p)))
          }}
          onEditProductDetail={(pId, updatedDetail) => {
            setProducts(
              products.map((p) =>
                p.productId === pId
                  ? {
                      ...p,
                      productDetail: p.productDetails.map((d) =>
                        d.productDetailId === updatedDetail.productDetailId ? updatedDetail : d
                      )
                    }
                  : p
              )
            )
            console.log(`Updated detail for product ${pId}:`, updatedDetail)
          }}
        />
      )}
    </div>
  )
}

export default ProductsManagement
