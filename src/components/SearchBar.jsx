import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handlePress = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Busca por nombre o número..."
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handlePress} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 46,
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});