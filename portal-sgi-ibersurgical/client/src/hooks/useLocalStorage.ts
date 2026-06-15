import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para gestionar datos en localStorage con sincronización automática
 * @param key - Clave para almacenar en localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns [value, setValue] - Similar a useState pero con persistencia
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obtener del localStorage
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error al leer localStorage[${key}]:`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor y guardarlo en localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error al guardar en localStorage[${key}]:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
