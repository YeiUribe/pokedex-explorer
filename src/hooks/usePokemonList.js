import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPokemonList } from '../services/pokemonService';
import { messageForError } from '../utils/errors';

// Tamano de pagina unico: antes estaba hardcodeado en tres lugares.
export const PAGE_SIZE = 20;

export const usePokemonList = () => {
  // useState: estado que consume la vista.
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // useRef: datos de control que no deben provocar renders ni cerrar valores obsoletos.
  const offsetRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const idsRef = useRef(new Set());
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  // useEffect: cancela la peticion en vuelo al desmontar (evita fugas y setState tardios).
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const loadInitial = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setPageError(null);
    loadingMoreRef.current = false;
    setLoadingMore(false);

    try {
      const data = await fetchPokemonList(PAGE_SIZE, 0, controller.signal);
      if (controller.signal.aborted || !mountedRef.current) return;

      idsRef.current = new Set(data.results.map((item) => item.id));
      offsetRef.current = data.results.length;
      hasMoreRef.current = Boolean(data.next);

      setPokemons(data.results);
      setHasMore(Boolean(data.next));
    } catch (err) {
      if (err?.code === 'CANCELLED' || !mountedRef.current) return;
      setPokemons([]);
      setError(messageForError(err));
    } finally {
      if (abortRef.current === controller && mountedRef.current) setLoading(false);
    }
  }, []);

  const loadMorePokemons = useCallback(async () => {
    // Lock con useRef: onEndReached puede dispararse dos veces antes del re-render.
    if (loadingMoreRef.current || !hasMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setPageError(null);

    try {
      const data = await fetchPokemonList(PAGE_SIZE, offsetRef.current, abortRef.current?.signal);
      if (!mountedRef.current) return;

      // Deduplicacion por id: si la API repite un recurso, no se agrega dos veces.
      const fresh = data.results.filter((item) => !idsRef.current.has(item.id));
      fresh.forEach((item) => idsRef.current.add(item.id));

      offsetRef.current += data.results.length;
      hasMoreRef.current = Boolean(data.next);

      setPokemons((prev) => [...prev, ...fresh]);
      setHasMore(Boolean(data.next));
    } catch (err) {
      if (err?.code === 'CANCELLED' || !mountedRef.current) return;
      setPageError(messageForError(err));
    } finally {
      loadingMoreRef.current = false;
      if (mountedRef.current) setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return {
    pokemons,
    loading,
    loadingMore,
    error,
    pageError,
    hasMore,
    loadMorePokemons,
    retry: loadInitial,
  };
};
