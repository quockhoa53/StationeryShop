import { http } from '~/utils/http'
import { AxiosError } from 'axios'
import { Category } from '~/types/category'

interface ApiResponse<T> {
  message: string
  result: T
  code: number
}

export const apiGetCategories = async (): Promise<Category[]> => {
  try {
    const response = await http.get<ApiResponse<Category[]>>('/categories')
    return response.data.result
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('Error fetching categories:', axiosError.message)
    throw axiosError
  }
}

export const getCategoryById = async (categoryId: string): Promise<Category> => {
  try {
    const response = await http.get<ApiResponse<Category>>(`/categories/${categoryId}`)
    return response.data.result
  } catch (error) {
    const axiosError = error as AxiosError
    console.error(`Error fetching category ${categoryId}:`, axiosError.message)
    throw axiosError
  }
}

export const createCategory = async (category: Omit<Category, 'category_id'>): Promise<Category> => {
  try {
    const response = await http.post<ApiResponse<Category>>('/categories', category)
    return response.data.result
  } catch (error) {
    const axiosError = error as AxiosError
    console.error('Error creating category:', axiosError.message)
    throw axiosError
  }
}
