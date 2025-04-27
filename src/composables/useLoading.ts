export function useLoading() {
  const activeLoadings = ref(new Set<string>())

  const withLoading = async <T>(key: string, promise: Promise<T>): Promise<T> => {
    activeLoadings.value.add(key)
    try {
      return await promise
    } finally {
      activeLoadings.value.delete(key)
    }
  }

  const isLoading = (key: string) => activeLoadings.value.has(key)

  return {
    activeLoadings,
    withLoading,
    isLoading
  }
}
