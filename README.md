# PokéDex Explorer

Aplicación móvil desarrollada con React Native y Expo para consultar Pokémon
utilizando la API pública de [PokéAPI](https://pokeapi.co/).

La aplicación permite:

- Consultar un listado paginado de Pokémon.
- Buscar por nombre, prefijo o número de identificación.
- Consultar el detalle de un Pokémon.
- Visualizar tipos, imagen oficial, altura, peso y estadísticas base.
- Mostrar estados de carga, errores y reintentos.
- Cancelar solicitudes HTTP cuando comienza una búsqueda nueva o se desmonta
  una pantalla.

## Tecnologías principales

- React Native
- Expo SDK 57
- React Navigation Native Stack
- React Native Safe Area Context
- PokéAPI
- `fetch` nativo, sin Axios ni otras librerías HTTP externas

## Árbol de carpetas

```text
pokedex-explorer/
├── assets/
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   ├── android-icon-monochrome.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/
│   ├── components/
│   │   ├── PokemonCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── StatBar.jsx
│   ├── hooks/
│   │   ├── usePokemonDetail.js
│   │   ├── usePokemonList.js
│   │   └── usePokemonSearch.js
│   ├── navigation/
│   │   └── AppNavigator.jsx
│   ├── screens/
│   │   ├── PokemonDetailScreen.jsx
│   │   └── PokemonListScreen.jsx
│   ├── services/
│   │   └── pokemonService.js
│   ├── theme/
│   │   └── colors.js
│   └── utils/
│       ├── errors.js
│       └── format.js
├── App.js
├── app.json
├── index.js
├── package.json
├── LICENSE
└── README.md
```

> `node_modules/` y `.expo/` son carpetas generadas localmente y no forman
> parte de la estructura funcional documentada de la aplicación.

## Responsabilidad de cada archivo

### Archivos raíz

| Archivo | Responsabilidad |
| --- | --- |
| `App.js` | Punto de entrada de la interfaz. Configura `SafeAreaProvider`, la barra de estado global y `AppNavigator`. |
| `index.js` | Registra el componente raíz de Expo mediante `registerRootComponent`. |
| `app.json` | Configuración de Expo: nombre, slug, iconos, splash screen, plataformas y opciones de ejecución. |
| `package.json` | Define metadatos del proyecto, dependencias y scripts de Expo. |
| `LICENSE` | Términos de licencia del proyecto. |
| `README.md` | Documentación de instalación, arquitectura y responsabilidades de los archivos. |

### `src/navigation/`

| Archivo | Responsabilidad |
| --- | --- |
| `AppNavigator.jsx` | Define el `NavigationContainer` y el Stack Navigator. Registra las rutas `PokemonList` y `PokemonDetail`, además de configurar sus encabezados y colores. |

### `src/screens/`

| Archivo | Responsabilidad |
| --- | --- |
| `PokemonListScreen.jsx` | Pantalla principal. Coordina la lista paginada, el buscador, los estados de carga y error, los reintentos y la navegación al detalle. |
| `PokemonDetailScreen.jsx` | Muestra la ficha completa del Pokémon seleccionado. Gestiona la carga inicial, errores, reintento, imagen, tipos, métricas y estadísticas. |

### `src/components/`

| Archivo | Responsabilidad |
| --- | --- |
| `PokemonCard.jsx` | Tarjeta reutilizable para cada Pokémon de la lista. Presenta imagen, número y nombre, y notifica la selección mediante `onPress`. |
| `SearchBar.jsx` | Barra de búsqueda controlada. Gestiona visualmente el campo de texto, el botón de búsqueda, el botón de limpieza y el indicador de carga. |
| `StatBar.jsx` | Representa una estadística base con su etiqueta, valor numérico y barra de progreso normalizada a un máximo de 255. |

### `src/hooks/`

| Archivo | Responsabilidad |
| --- | --- |
| `usePokemonList.js` | Controla la carga inicial y la paginación del listado. Evita duplicados, controla `loading`, `loadingMore`, errores y cancelación de solicitudes al desmontar. |
| `usePokemonSearch.js` | Ejecuta búsquedas por texto o ID desde la pantalla de lista. Cancela búsquedas anteriores, evita condiciones de carrera y expone resultados, carga, errores y limpieza. |
| `usePokemonDetail.js` | Carga el detalle de un Pokémon. Usa `AbortController` para cancelar solicitudes anteriores o pendientes al desmontar, e ignora errores producidos por cancelaciones. |

### `src/services/`

| Archivo | Responsabilidad |
| --- | --- |
| `pokemonService.js` | Capa de acceso a PokéAPI. Construye URLs, ejecuta `fetch`, aplica timeout y cancelación, transforma respuestas, normaliza datos incompletos y clasifica errores HTTP mediante `ApiError`. |

Funciones principales del servicio:

- `getPokemonList(limit, offset, signal)`: obtiene una página del listado.
- `getPokemonDetail(query, signal)`: obtiene el detalle por nombre o ID.
- `searchPokemonByName(query, signal)`: busca nombres mediante el catálogo cargado.
- `fetchPokemonList` y `fetchPokemonByNameOrId`: aliases conservados para
  compatibilidad con los hooks existentes.

### `src/theme/`

| Archivo | Responsabilidad |
| --- | --- |
| `colors.js` | Centraliza los colores de fondo, tarjetas, texto, botones, errores, barras de estadísticas y tipos de Pokémon. |

### `src/utils/`

| Archivo | Responsabilidad |
| --- | --- |
| `errors.js` | Traduce códigos de error del servicio a mensajes para la interfaz y conserva mensajes específicos de la API cuando existen. |
| `format.js` | Contiene helpers de presentación compartidos, como capitalizar nombres y formatear números con tres dígitos. |

## Flujo de datos

```text
PokemonListScreen
├── usePokemonList ──── pokemonService ──── PokéAPI /pokemon
├── usePokemonSearch ── pokemonService ──── PokéAPI /pokemon/{id o nombre}
├── SearchBar
└── PokemonCard ─────── navegación ─────── PokemonDetailScreen
                                           └── usePokemonDetail
                                               └── pokemonService
```

La interfaz no realiza solicitudes directamente. Las pantallas consumen hooks,
los hooks delegan en `pokemonService.js` y el servicio entrega datos
normalizados listos para renderizar.

## Estados de la interfaz

- **Carga inicial:** muestra un indicador mientras se obtiene la primera página
  o el detalle.
- **Carga adicional:** muestra un indicador independiente al paginar la lista.
- **Búsqueda:** deshabilita el campo y el botón mientras la consulta está en
  curso.
- **Error:** muestra un mensaje contextual y permite reintentar.
- **Sin resultados:** muestra una vista específica cuando una búsqueda no
  encuentra coincidencias.
- **Cancelación:** no muestra alertas falsas ni actualiza el estado después de
  cancelar una petición.

## Instalación y ejecución

Desde la carpeta del proyecto:

```bash
npm install
npm start
```

Comandos disponibles:

```bash
npm run android
npm run ios
npm run web
```

La ejecución web requiere que el proyecto tenga instaladas las dependencias
web compatibles con Expo. La aplicación móvil funciona con las dependencias
definidas actualmente en `package.json`.

## Capturas de la aplicación

Las capturas de los estados principales se encuentran en
[`assets/screenshots/`](./assets/screenshots/):

1. [01_loading.png](./assets/screenshots/01_loading.png): estado de carga
   inicial.
2. [02_lista_cuadricula.png](./assets/screenshots/02_lista_cuadricula.png):
   cuadrícula principal de dos columnas.
3. [03_scroll_infinito.png](./assets/screenshots/03_scroll_infinito.png):
   cargador de paginación al final de la lista.
4. [04_detalle_pokemon.png](./assets/screenshots/04_detalle_pokemon.png):
   ficha de detalle con tipos, medidas y estadísticas.
5. [05_error_busqueda.png](./assets/screenshots/05_error_busqueda.png):
   estado de búsqueda sin resultados.
