import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import StatBar from '../components/StatBar';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { colors } from '../theme/colors';
import { capitalize, formatPokemonNumber } from '../utils/format';

export default function PokemonDetailScreen({ route, navigation }) {
  const { identifier } = route.params ?? {};
  const { pokemon, loading, error, searchPokemon } = usePokemonDetail();

  // useEffect: carga la ficha al montar y cuando cambia el identificador.
  useEffect(() => {
    if (identifier) {
      searchPokemon(identifier);
    }
  }, [identifier, searchPokemon]);

  const goBack = () => navigation.goBack();

  const renderBackButton = () => (
    <Pressable style={styles.backButton} onPress={goBack} accessibilityRole="button">
      <Text style={styles.backButtonText}>← Volver a la lista</Text>
    </Pressable>
  );

  // Salvaguarda: sin identificador no se puede consultar la API.
  if (!identifier) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <Text style={styles.feedbackText}>No se recibió el identificador del Pokémon.</Text>
        {renderBackButton()}
      </View>
    );
  }

  // Estado de carga: el hook arranca en true, así no se ve el mensaje de "no encontrado".
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.feedbackText}>Cargando información del Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <Text style={[styles.feedbackText, { color: colors.error }]}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => searchPokemon(identifier)}
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
        {renderBackButton()}
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <Text style={styles.feedbackText}>No se encontró información del Pokémon.</Text>
        {renderBackButton()}
      </View>
    );
  }

  const formattedNumber = formatPokemonNumber(pokemon.id);
  const formattedName = capitalize(pokemon.name);

  return (
    <View style={styles.screen}>
      {/* StatusBar clara porque el header de la pila es rojo */}
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        {renderBackButton()}

        <Image source={{ uri: pokemon.imageUrl }} style={styles.image} resizeMode="contain" />

        <Text style={styles.number}>{formattedNumber}</Text>
        <Text style={styles.name}>{formattedName}</Text>

        {/* Tipos con el color definido en el tema */}
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

        {/* Medidas físicas ya convertidas en el servicio (dm -> m, hg -> kg) */}
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

        {/* Estadísticas base con barra de progreso */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Estadísticas Base</Text>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} label={stat.name} value={stat.value} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  feedbackText: {
    fontSize: 15,
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
    marginTop: 12,
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
