import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function StatBar({ label, value }) {
  const percentage = Math.min((value / 255) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={styles.value}>{value}</Text>
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
    width: 70,
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  value: {
    width: 35,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
    marginRight: 8,
  },
  barTrack: {
    flex: 1,
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