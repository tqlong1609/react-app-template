import { ReactNode } from 'react'

import { useResponsive } from '@/hooks/useResponsive'

interface ResponsiveProps {
  children: ReactNode
}

export const Desktop: React.FC<ResponsiveProps> = ({ children }) => {
  const { isDesktop, isDesktopXL } = useResponsive()
  return isDesktop || isDesktopXL ? <>{children}</> : null
}

export const Tablet: React.FC<ResponsiveProps> = ({ children }) => {
  const { isTablet } = useResponsive()
  return isTablet ? <>{children}</> : null
}

export const Mobile: React.FC<ResponsiveProps> = ({ children }) => {
  const { isMobile } = useResponsive()
  return isMobile ? <>{children}</> : null
}

export const Default: React.FC<ResponsiveProps> = ({ children }) => {
  const { isTablet, isDesktop, isDesktopXL } = useResponsive()
  return isTablet || isDesktop || isDesktopXL ? <>{children}</> : null
}
