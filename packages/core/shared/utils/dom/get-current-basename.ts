export const getCurrentBaseName = () => {
  return `/${window.location.pathname.split('/')[1]}`
}
