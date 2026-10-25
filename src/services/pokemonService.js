const BASE_URL = 'https://pokeapi.co/api/v2';
const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const REQUEST_TIMEOUT_MS = 10000;
const POKEMON_CATALOG_LIMIT = 10000;

let pokemonCatalogPromise;

// Error con codigo semantico: el servicio informa el tipo, la UI decide el mensaje.
export class ApiError extends Error {
  constructor(code, message) {
    super(message || code);
    this.name = 'ApiError';
    this.code = code;
  }
}

// fetch centralizado: timeout con AbortController y cancelacion desde el llamador.
const requestJson = async (path, externalSignal) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abortFromOutside = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else if (typeof externalSignal.addEventListener === 'function') {
      externalSignal.addEventListener('abort', abortFromOutside);
    } else {
      externalSignal.onabort = abortFromOutside;
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
    if (!response.ok) {
      const { status } = response;
      if (status === 404) {
        throw new ApiError('NOT_FOUND', 'No se encontró el Pokémon especificado (Error 404)');
      }
      if (status >= 500 && status <= 599) {
        throw new ApiError('SERVER', 'Error en el servidor de PokéAPI (Error 5xx)');
      }
      throw new ApiError('API_ERROR', `Error al consultar PokéAPI: código ${status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.name === 'AbortError') {
      const cancelled = Boolean(externalSignal?.aborted);
      throw new ApiError(cancelled ? 'CANCELLED' : 'TIMEOUT');
    }
    throw new ApiError('NETWORK');
  } finally {
    clearTimeout(timeoutId);
    if (externalSignal) {
      if (typeof externalSignal.removeEventListener === 'function') {
        externalSignal.removeEventListener('abort', abortFromOutside);
      } else {
        externalSignal.onabort = null;
      }
    }
  }
};

const buildImageUrl = (id) => `${IMAGE_BASE_URL}/${id}.png`;

const normalizePokemonListItem = (item) => {
  if (!item || typeof item !== 'object') return null;

  const urlParts = typeof item.url === 'string' ? item.url.split('/').filter(Boolean) : [];
  const parsedId = Number.parseInt(urlParts[urlParts.length - 1], 10);
  const id = Number.isFinite(parsedId) ? parsedId : null;
  const name = typeof item.name === 'string' ? item.name : '';

  if (!id || !name) return null;
  return { id, name, imageUrl: buildImageUrl(id) };
};

export const getPokemonList = async (limit = 20, offset = 0, signal) => {
  const data = await requestJson(`/pokemon?limit=${limit}&offset=${offset}`, signal);
  const results = Array.isArray(data?.results)
    ? data.results.map(normalizePokemonListItem).filter(Boolean)
    : [];

  return { results, next: typeof data?.next === 'string' ? data.next : null };
};

const fetchPokemonCatalog = () => {
  if (!pokemonCatalogPromise) {
    pokemonCatalogPromise = getPokemonList(POKEMON_CATALOG_LIMIT)
      .then(({ results }) => results)
      .catch((error) => {
        pokemonCatalogPromise = null;
        throw error;
      });
  }

  return pokemonCatalogPromise;
};

export const searchPokemonByName = async (query, signal) => {
  const sanitizedQuery = String(query ?? '').trim().toLowerCase();
  if (!sanitizedQuery) throw new ApiError('NOT_FOUND');
  if (signal?.aborted) throw new ApiError('CANCELLED');

  const catalog = await fetchPokemonCatalog();
  if (signal?.aborted) throw new ApiError('CANCELLED');

  return catalog.filter((pokemon) => pokemon.name.startsWith(sanitizedQuery));
};

export const getPokemonDetail = async (query, signal) => {
  const sanitizedQuery = String(query ?? '').trim().toLowerCase();
  if (!sanitizedQuery) throw new ApiError('NOT_FOUND');

  const identifier = /^\d+$/.test(sanitizedQuery)
    ? sanitizedQuery
    : encodeURIComponent(sanitizedQuery);
  const data = await requestJson(`/pokemon/${identifier}`, signal);
  const id = Number.isFinite(data?.id) ? data.id : null;
  const name = typeof data?.name === 'string' ? data.name : '';
  const types = Array.isArray(data?.types)
    ? data.types
        .map((entry) => entry?.type?.name)
        .filter((type) => typeof type === 'string' && type.length > 0)
    : [];
  const stats = Array.isArray(data?.stats)
    ? data.stats
        .map((entry) => ({
          name: typeof entry?.stat?.name === 'string' ? entry.stat.name : '',
          value: Number.isFinite(entry?.base_stat) ? entry.base_stat : 0,
        }))
        .filter((stat) => stat.name)
    : [];
  const imageUrl =
    typeof data?.sprites?.other?.['official-artwork']?.front_default === 'string'
      ? data.sprites.other['official-artwork'].front_default
      : id
        ? buildImageUrl(id)
        : null;

  return {
    id,
    name,
    height: Number.isFinite(data?.height) ? data.height / 10 : 0,
    weight: Number.isFinite(data?.weight) ? data.weight / 10 : 0,
    types,
    stats,
    imageUrl,
  };
};

// Aliases conservados para los hooks y consumidores existentes.
export const fetchPokemonList = getPokemonList;
export const fetchPokemonByNameOrId = getPokemonDetail;
