import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATAQUE',
  defense: 'DEFENSA',
  'special-attack': 'SP. ATQ.',
  'special-defense': 'SP. DEF.',
  speed: 'VELOCIDAD',
};

const STAT_COLORS = {
  hp: '#4ADE80',
  attack: '#F87171',
  defense: '#FBBF24',
  'special-attack': '#818CF8',
  'special-defense': '#34D399',
  speed: '#38BDF8',
};

export default function StatBar({ label, value }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const percentage = Math.min((safeValue / 255) * 100, 100);
  const displayLabel = STAT_LABELS[label] || String(label || '').replace(/-/g, ' ').toUpperCase();
  
  const fillColor = STAT_COLORS[label] || colors.statBarFill || colors.secondary || '#38BDF8';
  const trackColor = colors.statBarBackground || 'rgba(255, 255, 255, 0.08)';

  return (
    <View style={styles.container}>
      <Text style={styles.label} numberOfLines={1}>
        {displayLabel}
      </Text>
      <Text style={styles.value}>{safeValue}</Text>
      <View style={[styles.barTrack, { backgroundColor: trackColor }]}>
        <View 
          style={[
            styles.barFill, 
            { 
              width: `${percentage}%`,
              backgroundColor: fillColor,
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    flex: 1.1,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  value: {
    width: 36,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginRight: 10,
  },
  barTrack: {
    flex: 1.4,
    height: 7,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
});