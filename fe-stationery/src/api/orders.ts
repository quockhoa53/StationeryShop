import { AxiosError } from 'axios'
import { ApiResponse, CreateOrderParams } from '~/types/order'
import { http } from '~/utils/http'

const apiCreateOrderWithPayment = async ({
  orderDetails,
  userPromotionId,
  addressId,
  amount,
  note,
  accessToken
}: CreateOrderParams) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const body = {
      orderDetails,
      userPromotionId,
      addressId,
      amount,
      note
    }
    const response = await http.post('/purchase-orders/payment-momo', body, config)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data
    }
    return (error as Error).message
  }
}

const apiCheckTransactionStatus = async ({ orderId, accessToken }: { orderId: string; accessToken: string }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const response = await http.get(`/purchase-orders/payment-momo/transaction-status/${orderId}`, config)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data
    }
    return (error as Error).message
  }
}

//Order User
const apiGetUserPendingOrders = async ({ accessToken }: { accessToken: string }): Promise<ApiResponse> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const response = await http.get('/purchase-orders/user/pending', config)
    return response.data as ApiResponse
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as ApiResponse
    }
    throw new Error((error as Error).message)
  }
}

const apiGetUserProcessingOrders = async ({ accessToken }: { accessToken: string }): Promise<ApiResponse> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const response = await http.get('/purchase-orders/user/processing', config)
    return response.data as ApiResponse
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as ApiResponse
    }
    throw new Error((error as Error).message)
  }
}

const apiGetUserShippingOrders = async ({ accessToken }: { accessToken: string }): Promise<ApiResponse> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const response = await http.get('/purchase-orders/user/shipping', config)
    return response.data as ApiResponse
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as ApiResponse
    }
    throw new Error((error as Error).message)
  }
}

const apiGetUserCompletedOrders = async ({ accessToken }: { accessToken: string }): Promise<ApiResponse> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const response = await http.get('/purchase-orders/user/completed', config)
    return response.data as ApiResponse
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as ApiResponse
    }
    throw new Error((error as Error).message)
  }
}

const apiGetUserCanceledOrders = async ({ accessToken }: { accessToken: string }): Promise<ApiResponse> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const response = await http.get('/purchase-orders/user/canceled', config)
    return response.data as ApiResponse
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data as ApiResponse
    }
    throw new Error((error as Error).message)
  }
}

//Lấy thông tin sản phẩm đã order
const apiGetProductDetailsByOrder = async ({
  purchaseOrderId,
  accessToken
}: {
  purchaseOrderId: string
  accessToken: string
}): Promise<Promise<ApiResponse>> => {
  const response = await http.get(`/purchase-orders/${purchaseOrderId}/product-details`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return response.data
}

export {
  apiCreateOrderWithPayment,
  apiCheckTransactionStatus,
  apiGetUserPendingOrders,
  apiGetUserProcessingOrders,
  apiGetUserShippingOrders,
  apiGetUserCompletedOrders,
  apiGetUserCanceledOrders,
  apiGetProductDetailsByOrder
}
