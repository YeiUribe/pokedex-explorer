import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import { usePokemonList } from '../hooks/usePokemonList';
import { colors } from '../theme/colors';

export default function PokemonListScreen({ navigation }) {
  const {
    pokemons,
    loading,
    loadingMore,
    error,
    loadMorePokemons,
    retry,
  } = usePokemonList();

  const [searchError, setSearchError] = useState(null);

  const handleSearch = (query) => {
    if (!query || !query.trim()) {
      setSearchError('Por favor ingresa un nombre o ID');
      return;
    }
    setSearchError(null);
    navigation.navigate('PokemonDetail', { identifier: query.trim().toLowerCase() });
  };

  const handleSelectPokemon = (pokemon) => {
    navigation.navigate('PokemonDetail', { identifier: pokemon.name || pokemon.id });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>PokéDex Explorer</Text>
      <SearchBar onSearch={handleSearch} />
      {searchError && (
        <Text style={styles.searchErrorText}>{searchError}</Text>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  // Estado de carga inicial
  if (loading && (!pokemons || pokemons.length === 0)) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerText}>Cargando Pokémon...</Text>
      </SafeAreaView>
    );
  }

  // Estado de error inicial
  if (error && (!pokemons || pokemons.length === 0)) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={[styles.centerText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retry}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <FlatList
        data={pokemons || []}
        keyExtractor={(item) => String(item.id || item.name)}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() => handleSelectPokemon(item)}
          />
        )}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={loadMorePokemons}
        onEndReachedThreshold={0.5}
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
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.card,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchErrorText: {
    color: colors.error,
    textAlign: 'center',
    marginVertical: 4,
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  centerText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
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