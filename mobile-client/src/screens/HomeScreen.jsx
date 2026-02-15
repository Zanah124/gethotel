import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.badge}>L'expérience hôtelière 100% digitale</Text>
        <Text style={styles.title}>GetHotel</Text>
        <Text style={styles.subtitle}>Réservez. Gérez. Brillez.</Text>
        <Text style={styles.desc}>
          Trouvez et réservez votre séjour en quelques clics.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.primaryBtnText}>Trouver un hôtel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryBtnText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('About')}
      >
        <Text style={styles.linkText}>À propos de GetHotel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 24, paddingTop: 48 },
  hero: { alignItems: 'center', marginBottom: 32 },
  badge: {
    backgroundColor: 'rgba(73,185,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    color: '#49B9FF',
    marginBottom: 24,
    fontSize: 14,
  },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 22, color: '#f4B34C', fontWeight: '600', marginBottom: 16 },
  desc: { color: '#ccc', textAlign: 'center', marginBottom: 24, paddingHorizontal: 16 },
  primaryBtn: {
    backgroundColor: '#49B9FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 12,
    minWidth: 220,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#000', fontWeight: '600', fontSize: 16 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    minWidth: 220,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { alignItems: 'center' },
  linkText: { color: '#49B9FF', fontSize: 14 },
});
