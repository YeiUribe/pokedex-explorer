import React from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Barra controlada: el texto vive en la pantalla, así no se pierde al re-renderizar la lista.
export default function SearchBar({ value, onChangeText, onSearch, onClear, loading }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Nombre, primeras letras o número..."
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={onSearch}
          editable={!loading}
          accessibilityLabel="Buscar Pokémon por nombre, primeras letras o número"
        />
        {value ? (
          <Pressable
            onPress={onClear}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Limpiar búsqueda"
          >
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, (loading || pressed) && styles.buttonPressed]}
        onPress={onSearch}
        disabled={loading}
        android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        accessibilityRole="button"
        accessibilityLabel="Buscar"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Buscar</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 46,
    paddingHorizontal: 10,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    height: 44,
    paddingVertical: 0,
    color: colors.textPrimary,
  },
  button: {
    minWidth: 92,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
