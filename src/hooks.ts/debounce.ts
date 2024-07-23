"use client";
import { useState, useEffect } from "react";

// generic debounce fn for delayed effect of changes | useful scenario: onSearch
export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [delay, value]);

  return debouncedValue;
}

// Utility function to listen for changes | useful scenario: autoSave
export function useChangeListener(delay: number) {
  const [changeIncrementor, setChangeIncrementor] = useState(0);
  const changeWatcher = useDebounce(changeIncrementor, delay);
  const recordChanges = () =>
    setChangeIncrementor((prevState) => prevState + 1);
  return [changeWatcher, recordChanges];
}
