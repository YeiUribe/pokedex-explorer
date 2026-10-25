import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPokemonByNameOrId, searchPokemonByName } from '../services/pokemonService';
import { messageForError } from '../utils/errors';

// Busqueda de la pantalla de lista: devuelve el resultado para mostrarlo como tarjeta.
// results === null significa "no hay busqueda activa" (se ve la lista paginada).
//
// Los nombres admiten prefijos; las consultas numericas siguen buscando un id exacto.
export const usePokemonSearch = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const runSearch = useCallback(async (query) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    setError(null);

    try {
      const normalizedQuery = String(query ?? '').trim().toLowerCase();
      const data = /^\d+$/.test(normalizedQuery)
        ? [await fetchPokemonByNameOrId(normalizedQuery, controller.signal)]
        : await searchPokemonByName(normalizedQuery, controller.signal);
      if (requestId !== requestIdRef.current || !mountedRef.current) return null;
      setResults(data);
    } catch (err) {
      if (err?.code === 'CANCELLED' || requestId !== requestIdRef.current || !mountedRef.current) {
        return null;
      }
      setResults([]);
      setError(messageForError(err));
    } finally {
      if (requestId === requestIdRef.current && mountedRef.current) setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    abortRef.current?.abort();
    requestIdRef.current += 1;
    setResults(null);
    setError(null);
    setLoading(false);
  }, []);

  return { results, loading, error, runSearch, clearSearch };
};
