import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AboutScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>À propos de GetHotel</Text>
      <Text style={styles.desc}>
        La plateforme qui réunit réservation en ligne et gestion hôtelière en un seul lieu.
      </Text>
      <Text style={styles.paragraph}>
        Rendre la réservation et la gestion hôtelière simples pour tous : voyageurs et hôteliers.
        GetHotel centralise réservations, planning et facturation.
      </Text>
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Développement</Text>
        <Text style={styles.blockText}>Développé par FALIMANANA Lucie Zanah</Text>
        <Text style={styles.version}>Version 1.0</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Search')}>
        <Text style={styles.btnText}>Trouver un hôtel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#A48374' },
  content: { padding: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  desc: { fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 20 },
  paragraph: { color: 'rgba(255,255,255,0.85)', lineHeight: 22, marginBottom: 24 },
  block: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  blockTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 8 },
  blockText: { color: '#f4e4bc', marginBottom: 4 },
  version: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  btn: {
    backgroundColor: '#49B9FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
