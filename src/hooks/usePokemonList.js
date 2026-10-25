import { useState, useEffect } from 'react';
import { fetchPokemonList } from '../services/pokemonService';

export const usePokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadInitialPokemons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonList(20, 0);
      setPokemons(data.results);
      setOffset(20);
      setHasMore(Boolean(data.next));
    } catch (err) {
      setError('No se pudo cargar la lista de Pokémon.');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePokemons = async () => {
    if (loadingMore || !hasMore || loading) {
      return;
    }
    setLoadingMore(true);
    try {
      const data = await fetchPokemonList(20, offset);
      setPokemons((prev) => [...prev, ...data.results]);
      setOffset((prev) => prev + 20);
      setHasMore(Boolean(data.next));
    } catch (err) {
      // Error silencioso en paginación continua para no romper la vista
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      loadInitialPokemons();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    pokemons,
    loading,
    loadingMore,
    error,
    loadMorePokemons,
    retry: loadInitialPokemons,
  };
};