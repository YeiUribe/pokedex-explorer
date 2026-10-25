import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import { colors } from '../theme/colors';

export default function PokemonListScreen({
  pokemons,
  loading,
  loadingMore,
  error,
  searchError,
  onSearch,
  onSelectPokemon,
  onEndReached,
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>PokéDex Explorer</Text>
      <SearchBar onSearch={onSearch} loading={loading} />

      {/* Estado: Sin resultados o Error de búsqueda */}
      {searchError && (
        <View style={styles.centerMessage}>
          <Text style={styles.errorText}>{searchError}</Text>
        </View>
      )}

      {/* Estado: Cargando inicial */}
      {loading ? (
        <View style={styles.centerMessage}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando Pokémon...</Text>
        </View>
      ) : error ? (
        /* Estado: Error de red con reintento */
        <View style={styles.centerMessage}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Estado: Éxito con FlatList de 2 columnas */
        <FlatList
          data={pokemons}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <PokemonCard 
              pokemon={item} 
              onPress={() => onSelectPokemon(item.id)} 
            />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 12,
  },
  listPadding: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  centerMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});