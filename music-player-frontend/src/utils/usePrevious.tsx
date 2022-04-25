import { useEffect, useRef } from "react";

export const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const doParentsHaveClass = (
  element: HTMLElement,
  className: string
): boolean => {
  if (element.classList.contains(className)) return true;
  if (element.parentElement) {
    return doParentsHaveClass(element.parentElement, className);
  }
  return false;
};
