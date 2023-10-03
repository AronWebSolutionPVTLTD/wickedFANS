import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export default function useSearchParams(id) {
  const { search } = useLocation();

  return useMemo(() => (new URLSearchParams(search)).get(id), [search, id]);
}