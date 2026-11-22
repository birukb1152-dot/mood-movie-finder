import { useEffect, useState } from "react";

const readStorage = (key, initialValue) => {
  try {
    const stored = window.localStorage.getItem(key);

    return stored !== null ? JSON.parse(stored) : initialValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return initialValue;
  }
};

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  // Save changes and notify other components in the same tab.
  useEffect(() => {
    try {
      const serializedValue = JSON.stringify(value);

      if (serializedValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serializedValue);
      }

      window.dispatchEvent(
        new CustomEvent("local-storage-update", {
          detail: { key, value },
        }),
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [key, value]);

  // Synchronize changes from other components and browser tabs.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key || event.key === null) {
        setValue(readStorage(key, initialValue));
      }
    };

    const handleLocalStorageUpdate = (event) => {
      if (event.detail?.key === key) {
        setValue(event.detail.value);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage-update", handleLocalStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "local-storage-update",
        handleLocalStorageUpdate,
      );
    };
  }, [key, initialValue]);

  return [value, setValue];
};
