export const isMobile = (): boolean => {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|ios|android|Mobile|IEMobile|Opera Mini|JUC)/i
  )
  if (flag === null) {
    return false
  } else {
    return true
  }
}
