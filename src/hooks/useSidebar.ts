import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage sidebar state and responsiveness.
 */
export const useSidebar = (breakpoint: number = 1024) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false); // Close mobile sidebar when transitioning to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  return {
    isOpen,
    isMobile,
    toggle,
    close,
    open,
  };
};
