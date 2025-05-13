import { Category } from '~/types/category'

const categoriesToOptions = (categories: Category[]) => {
  return categories.map((category) => {
    return {
      label: category.categoryName,
      value: category.categoryId
    }
  })
}

export { categoriesToOptions }
