// /hooks/useUpdateCard.js
import { useRouter } from 'next/router'
import { useState } from 'react'

const useCreateCompany = (cardId) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateCard = async (cardData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/createcompany', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, cardData }),
      })

      if (!response.ok) {
        throw new Error('Error updating card')
      }

      setIsLoading(false)
      router.push('/addpage')
    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
  }

  return { updateCard, isLoading, error }
}

export default useCreateCompany
