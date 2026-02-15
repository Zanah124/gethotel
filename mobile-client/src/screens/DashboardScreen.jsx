import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mon compte</Text>
        <Text style={styles.welcome}>Connectez-vous pour accéder à votre tableau de bord et vos réservations.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const name = user.prenom || user.nom || user.email || 'Client';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de bord</Text>
      <Text style={styles.welcome}>Bienvenue, {name}</Text>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('MyReservations')}
      >
        <Text style={styles.cardTitle}>Mes réservations</Text>
        <Text style={styles.cardDesc}>Voir et gérer vos réservations</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.cardTitle}>Trouver un hôtel</Text>
        <Text style={styles.cardDesc}>Rechercher et réserver</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  welcome: { color: '#666', marginBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  cardDesc: { color: '#666', fontSize: 14 },
  btn: {
    backgroundColor: '#7238D4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { color: '#7238D4', textAlign: 'center', marginTop: 16, fontSize: 14 },
  logoutBtn: { marginTop: 24, paddingVertical: 12, alignItems: 'center' },
  logoutText: { color: '#ef4444', fontSize: 14 },
});
