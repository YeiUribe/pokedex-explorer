const BASE_URL = 'https://pokeapi.co/api/v2';
const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const REQUEST_TIMEOUT_MS = 10000;

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
      throw new ApiError(response.status === 404 ? 'NOT_FOUND' : 'SERVER');
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

export const fetchPokemonList = async (limit = 20, offset = 0, signal) => {
  const data = await requestJson(`/pokemon?limit=${limit}&offset=${offset}`, signal);

  // La API devuelve la URL de cada recurso; el id numerico esta al final.
  const results = data.results.map((item) => {
    const urlParts = item.url.split('/').filter(Boolean);
    const id = Number.parseInt(urlParts[urlParts.length - 1], 10);
    return { id, name: item.name, imageUrl: buildImageUrl(id) };
  });

  return { results, next: data.next };
};

export const fetchPokemonByNameOrId = async (query, signal) => {
  const sanitizedQuery = String(query ?? '').trim().toLowerCase();
  if (!sanitizedQuery) throw new ApiError('NOT_FOUND');

  const data = await requestJson(`/pokemon/${encodeURIComponent(sanitizedQuery)}`, signal);

  return {
    id: data.id,
    name: data.name,
    height: data.height / 10, // decimetros -> metros
    weight: data.weight / 10, // hectogramos -> kilogramos
    types: data.types.map((entry) => entry.type.name),
    stats: data.stats.map((entry) => ({ name: entry.stat.name, value: entry.base_stat })),
    imageUrl:
      data.sprites?.other?.['official-artwork']?.front_default || buildImageUrl(data.id),
  };
};
