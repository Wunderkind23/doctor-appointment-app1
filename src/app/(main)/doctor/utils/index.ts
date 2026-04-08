export const formatNaira = (value: number): string => {
  return value.toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
  })
}
