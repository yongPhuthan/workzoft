// useProducts.ts
import { useQuery } from 'react-query'

export const useProducts = () => {
  return useQuery('products', async () => {
    const response = await fetch('/api/products')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return data
  })
}
