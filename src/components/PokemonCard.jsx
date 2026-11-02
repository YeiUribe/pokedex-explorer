import React, { memo } from 'react';
import { View, Pressable, Text, Image, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { capitalize, formatPokemonNumber } from '../utils/format';

function PokemonCard({ pokemon, onPress }) {
  const formattedNumber = formatPokemonNumber(pokemon.id);
  const formattedName = capitalize(pokemon.name);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(pokemon)}
      android_ripple={{ color: colors.border }}
      accessibilityRole="button"
      accessibilityLabel={`${formattedName}, número ${formattedNumber}`}
    >
      <View style={styles.topBadge}>
        <Text style={styles.number}>{formattedNumber}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {formattedName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    height: 195,
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  topBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  number: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 105,
    height: 105,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
    maxWidth: '100%',
    textAlign: 'center',
  },
});

export default memo(PokemonCard);