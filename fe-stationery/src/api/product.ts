import { http } from '~/utils/http'
import { AxiosError } from 'axios'

const apiGetAllProductsWithDefaultPD = async ({
  page = '0',
  limit = '10',
  sortBy,
  minPrice,
  maxPrice,
  categoryId,
  search,
  accessToken
}: {
  page?: string
  limit?: string
  sortBy?: string
  minPrice?: string
  maxPrice?: string
  categoryId?: string
  search?: string
  accessToken?: string
}) => {
  try {
    const config = {
      params: {
        page,
        limit,
        sortBy,
        minPrice,
        maxPrice,
        categoryId,
        search
      },
      headers: {} as Record<string, string>
    }

    // Chỉ thêm Authorization header nếu có accessToken
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await http.get('/products', config)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data
    }
    return error
  }
}

const apiGetDetailProduct = async (slug?: string) => {
  try {
    const response = await http.get('/products/' + slug)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data // Return server error response if available
    }
    return error // Avoid undefined error
  }
}
const apiGetProductDetailsByProductId = async ({ productId }: { productId: string }) => {
  try {
    const response = await http.get('/products/product-detail/' + productId)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data // Return server error response if available
    }
    return error // Avoid undefined error
  }
}
const apiGetAllProducts = async ({
  page,
  limit,
  sortBy,
  minPrice,
  maxPrice,
  categoryId,
  search
}: {
  page: string
  limit: string
  sortBy?: string
  minPrice?: string
  maxPrice?: string
  categoryId?: string
  search?: string
}) => {
  try {
    const params = {
      page,
      limit,
      sortBy,
      minPrice,
      maxPrice,
      categoryId,
      search
    }
    const response = await http.get('/products/get-products', { params })
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data // Return server error response if available
    }
    return error // Avoid undefined error
  }
}
const apiFetchColorSizeProductDetail = async (slug?: string) => {
  try {
    const response = await http.get('/products/color-size/' + slug)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data // Return server error response if available
    }
    return error // Avoid undefined error
  }
}
const apiGetSimilarProducts = async (productId: string) => {
  try {
    const response = await http.get(`/products/similar/${productId}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data
    }
    return error
  }
}

export {
  apiGetAllProductsWithDefaultPD,
  apiGetDetailProduct,
  apiFetchColorSizeProductDetail,
  apiGetAllProducts,
  apiGetProductDetailsByProductId,
  apiGetSimilarProducts
}
