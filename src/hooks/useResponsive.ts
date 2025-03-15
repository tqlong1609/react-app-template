import { useMediaQuery } from 'react-responsive'

import { Responsive } from '@/configs/responsive'

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isDesktopXL: boolean
}

export const useResponsive = (): ResponsiveState => {
  // check if the device is an iPad
  const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document

  return {
    isMobile: useMediaQuery({ maxWidth: Responsive.MOBILE_SIZE }), // Mobile
    isTablet:
      useMediaQuery({ minWidth: Responsive.MOBILE_SIZE + 1, maxWidth: Responsive.TABLET_SIZE }) &&
      !isIPad, // Tablet < 10 inch
    isDesktop:
      useMediaQuery({ minWidth: Responsive.TABLET_SIZE + 1, maxWidth: Responsive.DESKTOP_SIZE }) ||
      isIPad, // iPad 10 will be PC
    isDesktopXL: useMediaQuery({ minWidth: Responsive.DESKTOP_XL_SIZE }) // Desktop large
  }
}
