interface SizeSlug {
  size: string
  slug: string
}
interface ColorSize {
  colorId: string
  hex: string
  sizes: SizeSlug[]
}
export type { ColorSize, SizeSlug }
