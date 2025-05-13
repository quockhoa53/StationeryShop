import { CartItem } from './cart'

type OrderDetails = { items: CartItem[]; totalAmount: number }

interface OrderItem {
  productDetailId: string
  quantity: number
  productPromotionId: string | null
}
interface CreateOrderParams {
  orderDetails: OrderItem[]
  userPromotionId: string | null
  addressId: string
  amount: number
  note: string | null
  accessToken: string
}
interface UserInfoOrder {
  name: string
  phone: string
  note: string | null
  email: string
}

export interface OrderDetailResponse {
  productDetailId: string
  quantity: number
}

export interface PurchaseOrderResponse {
  purchaseOrderId: string
  createdAt: string | null
  pdfUrl: string | null
  productPromotionId: string | null
  userPromotionId: string | null
  status: 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELED'
  amount: number
  orderDetails: Array<{
    productDetailId: string
    quantity: number
  }>
}

export interface ApiResponse {
  code: number
  message: string
  result: PurchaseOrderResponse[]
}

export type { OrderDetails, CreateOrderParams, UserInfoOrder }
