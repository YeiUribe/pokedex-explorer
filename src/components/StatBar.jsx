import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// Nombres legibles: la API devuelve hp, special-attack, special-defense, etc.
const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATAQUE',
  defense: 'DEFENSA',
  'special-attack': 'SP. ATQ.',
  'special-defense': 'SP. DEF.',
  speed: 'VELOCIDAD',
};

export default function StatBar({ label, value }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const percentage = Math.min((safeValue / 255) * 100, 100);
  const displayLabel = STAT_LABELS[label] || String(label || '').replace(/-/g, ' ').toUpperCase();

  return (
    <View style={styles.container}>
      <Text style={styles.label} numberOfLines={1}>
        {displayLabel}
      </Text>
      <Text style={styles.value}>{safeValue}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    flex: 1.1,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  value: {
    width: 34,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
    marginRight: 8,
  },
  barTrack: {
    flex: 1.4,
    height: 8,
    backgroundColor: colors.statBarBackground,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.statBarFill,
    borderRadius: 4,
  },
});
