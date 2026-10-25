import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPokemonByNameOrId } from '../services/pokemonService';
import { messageForError } from '../utils/errors';

export const usePokemonDetail = () => {
  const [pokemon, setPokemon] = useState(null);
  // Arranca en true para no mostrar el mensaje de "no encontrado" antes del primer fetch.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useRef: descarta respuestas viejas cuando el usuario navega rapido entre fichas.
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

  const searchPokemon = useCallback(async (query) => {
    const sanitized = String(query ?? '').trim();
    if (!sanitized) {
      setPokemon(null);
      setError(messageForError({ code: 'NOT_FOUND' }));
      setLoading(false);
      return null;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchPokemonByNameOrId(sanitized, controller.signal);
      if (requestId !== requestIdRef.current || !mountedRef.current) return null;
      setPokemon(data);
      return data;
    } catch (err) {
      if (err?.code === 'CANCELLED' || requestId !== requestIdRef.current || !mountedRef.current) {
        return null;
      }
      setPokemon(null);
      setError(messageForError(err));
      return null;
    } finally {
      if (requestId === requestIdRef.current && mountedRef.current) setLoading(false);
    }
  }, []);

  return { pokemon, loading, error, searchPokemon };
};
