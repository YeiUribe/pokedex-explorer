import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
 
export default function PokemonCard({ pokemon, onPress }) {
  const formattedNumber = `#${String(pokemon.id).padStart(3, '0')}`;
  const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
 
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{ uri: pokemon.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.number}>{formattedNumber}</Text>
      <Text style={styles.name}>{formattedName}</Text>
    </TouchableOpacity>
  );
}
 
const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    margin: 8,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 100,
    height: 100,
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
  },
});