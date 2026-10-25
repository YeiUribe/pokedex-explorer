import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import StatBar from '../components/StatBar';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { colors } from '../theme/colors';

export default function PokemonDetailScreen({ route, navigation }) {
  const { identifier } = route.params || {};
  const { pokemon, loading, error, searchPokemon, clearDetail } = usePokemonDetail();

  useEffect(() => {
    if (identifier) {
      searchPokemon(identifier);
    }
    return () => {
      clearDetail();
    };
  }, [identifier]);

  // Estado de carga
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.feedbackText}>Cargando información del Pokémon...</Text>
      </View>
    );
  }

  // Estado de error (ej: búsqueda fallida o sin internet)
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.feedbackText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => searchPokemon(identifier)}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.backButton, { marginTop: 12, alignSelf: 'center' }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver a la lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.feedbackText}>No se encontró información del Pokémon</Text>
        <TouchableOpacity 
          style={[styles.backButton, { marginTop: 12, alignSelf: 'center' }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver a la lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formattedNumber = `#${String(pokemon.id).padStart(3, '0')}`;
  const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Volver a la lista</Text>
      </TouchableOpacity>

      <Image 
        source={{ uri: pokemon.imageUrl }} 
        style={styles.image} 
        resizeMode="contain" 
      />
      <Text style={styles.number}>{formattedNumber}</Text>
      <Text style={styles.name}>{formattedName}</Text>

      {/* Tipos de Pokémon */}
      <View style={styles.typesContainer}>
        {pokemon.types.map((type) => {
          const badgeColor = colors.types?.[type] || colors.primary;
          return (
            <View key={type} style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
              <Text style={styles.typeText}>{type.toUpperCase()}</Text>
            </View>
          );
        })}
      </View>

      {/* Medidas físicas */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>ALTURA</Text>
          <Text style={styles.metricValue}>{pokemon.height} m</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>PESO</Text>
          <Text style={styles.metricValue}>{pokemon.weight} kg</Text>
        </View>
      </View>

      {/* Estadísticas base */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estadísticas Base</Text>
        {pokemon.stats.map((stat) => (
          <StatBar key={stat.name} label={stat.name} value={stat.value} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  feedbackText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginVertical: 16,
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 2,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
});