// Helpers de presentacion compartidos por lista, tarjeta y detalle.
export const capitalize = (text = '') =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : '';

export const formatPokemonNumber = (id) => `#${String(id).padStart(3, '0')}`;
