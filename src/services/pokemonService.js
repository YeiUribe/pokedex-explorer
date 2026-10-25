const BASE_URL = 'https://pokeapi.co/api/v2';
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export const fetchPokemonList = async (limit = 20, offset = 0) => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  const data = await response.json();
  
  // Extraer el id numérico del final de la URL para construir la imagen directa
  const results = data.results.map((item) => {
    const urlParts = item.url.split('/').filter(Boolean);
    const id = parseInt(urlParts[urlParts.length - 1], 10);
    return {
      id,
      name: item.name,
      imageUrl: `${IMAGE_BASE_URL}/${id}.png`,
    };
  });

  return { results, next: data.next };
};

export const fetchPokemonByNameOrId = async (query) => {
  // Limpieza: minúsculas y sin espacios iniciales o finales
  const sanitizedQuery = String(query).trim().toLowerCase();
  const response = await fetch(`${BASE_URL}/pokemon/${sanitizedQuery}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('NOT_FOUND');
    }
    throw new Error('NETWORK_ERROR');
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    height: data.height / 10, // Conversión decímetros a metros
    weight: data.weight / 10, // Conversión hectogramos a kilogramos
    types: data.types.map((entry) => entry.type.name),
    stats: data.stats.map((entry) => ({
      name: entry.stat.name,
      value: entry.base_stat,
    })),
    imageUrl: data.sprites.other?.['official-artwork']?.front_default || `${IMAGE_BASE_URL}/${data.id}.png`,
  };
};