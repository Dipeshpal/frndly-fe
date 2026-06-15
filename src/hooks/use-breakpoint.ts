import { useWindowDimensions } from 'react-native';

export interface Breakpoint {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Responsive breakpoint helper built on useWindowDimensions (never Dimensions.get).
 * mobile < 768 <= tablet < 1024 <= desktop
 */
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
}
