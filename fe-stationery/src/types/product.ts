import { Review } from './comment'
import { ProductPromotion } from './promotion'

interface Size {
  sizeId: string
  name: string
  priority: number
}

export interface ProductDetail {
  productDetailId: string
  name: string
  slug: string
  originalPrice: number
  stockQuantity: number
  soldQuantity: number
  discountPrice: number
  size: Size
  color: Color
  totalRating: number
  description: string
  productPromotions: ProductPromotion[]
  images: Image[] | null
  productId: string
  createdAt: string
}

interface Image {
  imageId: string
  url: string
  priority: number
}

interface Color {
  colorId: string
  name: string
  hex: string
}

interface ProductColor {
  productColorId: string
  color: Color
  productDetails: ProductDetail[]
  images: Image[]
  sizes: Size[]
}

interface FetchColor {
  colorId: string
  hex: string
  slug: string
}

interface Product {
  productId: string
  description: string
  slug: string
  name: string
  category: {
    categoryId: string
    categoryName: string
  }
  minPrice: number
  soldQuantity: number
  quantity: number
  totalRating: number
  productDetail: ProductDetail
  fetchColor: FetchColor[]
  img: string
  createdAt: string
}

interface ProductDeatilResponse extends Product {
  image: Image[]
  reviews: Review[]
}

interface ListProductDetail extends Omit<Product, 'productDetail'> {
  productDetails: ProductDetail[]
}

export type { Product, Color, ProductColor, ProductDeatilResponse, Image, Size, FetchColor, ListProductDetail }
