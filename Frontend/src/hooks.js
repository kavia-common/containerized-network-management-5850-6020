/**
 * Hooks for sorting and filtering device lists.
 */
import { useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export function useSort(items, defaultKey = 'name') {
  /** Sort hook returns sorted items, sort key, and setter */
  const [sortKey, setSortKey] = useState(defaultKey);
  const sorted = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : [];
    arr.sort((a, b) => String(a?.[sortKey] ?? '').localeCompare(String(b?.[sortKey] ?? '')));
    return arr;
  }, [items, sortKey]);
  return { sorted, sortKey, setSortKey };
}

// PUBLIC_INTERFACE
export function useFilter(items) {
  /** Filter hook for type and status */
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const filtered = useMemo(() => {
    let arr = Array.isArray(items) ? [...items] : [];
    if (type) arr = arr.filter(d => d.type === type);
    if (status) arr = arr.filter(d => d.status === status);
    return arr;
  }, [items, type, status]);
  return { filtered, type, status, setType, setStatus };
}
