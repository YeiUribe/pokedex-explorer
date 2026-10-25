import { useState } from 'react';
import { fetchPokemonByNameOrId } from '../services/pokemonService';
 
export const usePokemonDetail = () => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const searchPokemon = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPokemonByNameOrId(query);
      setPokemon(data);
      return data;
    } catch (err) {
      if (err.message === 'NOT_FOUND') {
        setError('El Pokémon buscado no existe.');
      } else {
        setError('Error al conectar con el servidor.');
      }
      setPokemon(null);
      return null;
    } finally {
      setLoading(false);
    }
  };
 
  const clearDetail = () => {
    setPokemon(null);
    setError(null);
  };
 
  return {
    pokemon,
    loading,
    error,
    searchPokemon,
    clearDetail,
    setPokemonDirect: setPokemon,
  };
};
 