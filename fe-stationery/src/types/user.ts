import { Address } from './address'

type Role = {
  roleId: string
  roleName: string
  description: string
}

type User = {
  userId: string
  avatar: string
  firstName: string
  lastName: string
  email: string
  phone: string
  addresses: Address[]
  role: Role
  carts: any[] // Replace `any` with the appropriate type for cart items if available
  dob: string // Date of birth in ISO format (e.g., "2012-11-11")
  searchHistory: any[]
}

interface UserProfileForm {
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  dob: string | null
  avatar: File | null
}

export type { User, Address, Role, UserProfileForm }
