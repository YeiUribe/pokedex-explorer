import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ActivityIndicator, View } from 'react-native';

import PokemonListScreen from './src/screens/PokemonListScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import { usePokemonList } from './src/hooks/usePokemonList';
import { usePokemonDetail } from './src/hooks/usePokemonDetail';
import { colors } from './src/theme/colors';

export default function App() {
  const { pokemons, loading, loadingMore, error, loadMorePokemons, retry } = usePokemonList();
  const { pokemon: selectedPokemon, loading: loadingDetail, error: searchError, searchPokemon, clearDetail } = usePokemonDetail();
  const [activeView, setActiveView] = useState('list'); // 'list' | 'detail'

  const handleSearch = async (query) => {
    const result = await searchPokemon(query);
    if (result) {
      setActiveView('detail');
    }
  };

  const handleSelectPokemon = async (id) => {
    const result = await searchPokemon(id);
    if (result) {
      setActiveView('detail');
    }
  };

  const handleBackToList = () => {
    clearDetail();
    setActiveView('list');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {loadingDetail ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : activeView === 'detail' && selectedPokemon ? (
          <PokemonDetailScreen 
            pokemon={selectedPokemon} 
            onBack={handleBackToList} 
          />
        ) : (
          <PokemonListScreen
            pokemons={pokemons}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            searchError={searchError}
            onSearch={handleSearch}
            onSelectPokemon={handleSelectPokemon}
            onEndReached={loadMorePokemons}
            onRetry={retry}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});