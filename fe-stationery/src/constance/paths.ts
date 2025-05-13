const publicPaths = {
  PUBLIC: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  PRODUCT_DETAIL: '/products/:slug',

  DASHBOARD: '/dashboard',
  NOT_FOUND: '/not-found',
  PRODUCT: '/product',
  ABOUT: '/about',
  SERVICE: '/service',
  CONTACT: '/contact',
  SUPPORT_PURCHASE_GUIDE: '/support/shopping-ordering-guide',
  SUPPORT_WARRANTY_POLICY: '/support/warranty-policy',
  RETURN_EXCHANGE_POLICY: '/support/return-exchange-policy',
  SHIPPING_POLICY: '/support/shipping-policy'
}
const userPaths = {
  PROFILE: '/user/profile'
}

const departmentPath = {
  DASHBOARD: '/department/dashboard',
  PRODUCT: 'product',
  CREATE_REQUEST: 'create-request',
  INVOICE: 'invoice',
  NOTIFICATION: 'notification',
  SUPPORT: 'support'
}

const adminPaths = {
  ADMIN: '/admin',
  USER: '/admin/users',
  PRODUCT_CATEGORY: '/admin/product-categories',
  COLOR: '/admin/product-colors',
  SIZE: '/admin/product-sizes',
  PRODUCT: '/admin/products',
  ORDER: '/admin/orders',
  VOUCHER: '/admin/vouchers'
}
export { publicPaths, userPaths, departmentPath, adminPaths }
