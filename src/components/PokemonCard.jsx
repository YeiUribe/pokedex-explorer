import React, { memo } from 'react';
import { Pressable, Text, Image, StyleSheet } from 'react-native';
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
      {/* Image con tamaño fijo: evita el salto de layout mientras descarga */}
      <Image
        source={{ uri: pokemon.imageUrl }}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <Text style={styles.number}>{formattedNumber}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {formattedName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    height: 190,
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
  number: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
    maxWidth: '100%',
  },
});

// memo: la tarjeta solo se re-renderiza si cambia su Pokémon o el handler.
export default memo(PokemonCard);
