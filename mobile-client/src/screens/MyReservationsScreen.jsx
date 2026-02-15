import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMyReservations } from '../services/reservationService';

export default function MyReservationsScreen({ navigation }) {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (!user) {
      setList([]);
      setLoading(false);
      return;
    }
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await getMyReservations();
      const data = res?.data ?? res ?? [];
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const formatDate = (d) => {
    if (!d) return '—';
    const x = new Date(d);
    return x.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardNum}>#{item.numero_reservation || item.id}</Text>
      <Text style={styles.cardHotel}>{item.hotel_nom || item.hotel?.nom || 'Hôtel'}</Text>
      <Text style={styles.cardDates}>
        {formatDate(item.date_arrivee)} → {formatDate(item.date_depart)}
      </Text>
      <Text style={[styles.cardStatus, item.statut === 'annulee' && styles.statusCanceled]}>
        {item.statut === 'annulee' ? 'Annulée' : item.statut || 'Confirmée'}
      </Text>
    </View>
  );

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.empty}>Connectez-vous pour voir vos réservations.</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginBtnText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && list.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#7238D4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id || item.numero_reservation || Math.random())}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune réservation.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={['#7238D4']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingTop: 48 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardNum: { fontSize: 12, color: '#7238D4', fontWeight: '600', marginBottom: 4 },
  cardHotel: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  cardDates: { color: '#666', fontSize: 14, marginBottom: 4 },
  cardStatus: { color: '#22c55e', fontSize: 14, fontWeight: '500' },
  statusCanceled: { color: '#ef4444' },
  empty: { textAlign: 'center', color: '#666', marginTop: 24 },
  loginBtn: {
    backgroundColor: '#7238D4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  loginBtnText: { color: '#fff', fontWeight: '600' },
});
