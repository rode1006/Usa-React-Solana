const breakPointsMobilePC = '62em'
export function onBreackpointChange(cb: () => void): { cancel(): void } {
  const mediaQueryLists = [`(max-width: ${breakPointsMobilePC})`].map((m) => window.matchMedia(m))
  mediaQueryLists.forEach((mql) => mql.addEventListener('change', cb))
  return {
    cancel() {
      mediaQueryLists.forEach((mql) => mql.removeEventListener('change', cb))
    }
  }
}
