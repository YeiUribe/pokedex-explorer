import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { colors } from '../theme/colors';

export default function PokemonListScreen({ navigation }) {
  const {
    pokemons,
    loading,
    loadingMore,
    error,
    pageError,
    loadMorePokemons,
    retry,
  } = usePokemonList();

  const {
    results,
    loading: searching,
    error: searchError,
    runSearch,
    clearSearch,
  } = usePokemonSearch();

  // useState: la consulta vive aquí, no dentro de SearchBar, para que no se pierda
  // cuando la FlatList se vuelve a renderizar (paginación, errores, etc.).
  const [query, setQuery] = useState('');
  const [inputError, setInputError] = useState(null);

  const searchActive = results !== null;
  const data = searchActive ? results : pokemons;

  const handleSearch = () => {
    if (searching) return;
    if (!query.trim()) {
      setInputError('Escribe un nombre o un número de Pokémon.');
      return;
    }
    setInputError(null);
    runSearch(query);
  };

  const handleChangeQuery = (text) => {
    setQuery(text);
    setInputError(null);
  };

  const handleClearSearch = () => {
    setQuery('');
    setInputError(null);
    clearSearch();
  };

  const handleSelectPokemon = useCallback(
    (pokemon) => {
      navigation.navigate('PokemonDetail', { identifier: pokemon.id });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => <PokemonCard pokemon={item} onPress={handleSelectPokemon} />,
    [handleSelectPokemon]
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  // Se pasa el elemento ya renderizado (no la función) para que React no remonte
  // el header en cada render y el buscador no pierda el foco ni el texto.
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>PokéDex Explorer</Text>
      <SearchBar
        value={query}
        onChangeText={handleChangeQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        loading={searching}
      />
      {inputError ? <Text style={styles.inlineError}>{inputError}</Text> : null}
      {searchActive ? (
        <Pressable style={styles.clearChip} onPress={handleClearSearch} accessibilityRole="button">
          <Text style={styles.clearChipText}>Volver a la lista completa</Text>
        </Pressable>
      ) : null}
    </View>
  );

  const renderFooter = () => {
    if (searchActive) return null;
    if (loadingMore) {
      return (
        <View style={styles.footerBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.footerText}>Cargando más Pokémon...</Text>
        </View>
      );
    }
    if (pageError) {
      return (
        <View style={styles.footerBox}>
          <Text style={styles.inlineError}>{pageError}</Text>
          <Pressable style={styles.retryButton} onPress={loadMorePokemons} accessibilityRole="button">
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (!searchActive || searching) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Sin resultados</Text>
        <Text style={styles.emptyText}>
          {searchError || `No se encontró ningún Pokémon con "${query.trim()}".`}
        </Text>
        <Pressable style={styles.retryButton} onPress={handleClearSearch} accessibilityRole="button">
          <Text style={styles.retryButtonText}>Ver todos los Pokémon</Text>
        </Pressable>
      </View>
    );
  };

  // Estado de carga inicial (solo cuando no hay nada en pantalla)
  if (loading && !searchActive && pokemons.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerText}>Cargando Pokémon...</Text>
      </SafeAreaView>
    );
  }

  // Estado de error de red inicial, con reintento
  if (error && !searchActive && pokemons.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={[styles.centerText, { color: colors.error }]}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={retry} accessibilityRole="button">
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* FlatList: grid de 2 columnas con scroll infinito y footer de paginación */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={renderFooter()}
        ListEmptyComponent={renderEmpty()}
        onEndReached={searchActive ? undefined : loadMorePokemons}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 32,
  },
  footerBox: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
  },
  inlineError: {
    color: colors.error,
    textAlign: 'center',
    fontSize: 13,
    marginTop: 6,
    marginHorizontal: 16,
  },
  clearChip: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearChipText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  emptyContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  centerText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
