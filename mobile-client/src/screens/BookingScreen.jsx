import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createReservation } from '../services/reservationService';
import { getAvailableRooms } from '../services/hotelService';

export default function BookingScreen({ route, navigation }) {
  const { hotel } = route.params || {};
  const [dates, setDates] = useState({ arrival: '', departure: '' });
  const [guests, setGuests] = useState('1');
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const numAdults = parseInt(guests, 10) || 1;

  useEffect(() => {
    if (!hotel?.id || !dates.arrival || !dates.departure) {
      setRooms([]);
      return;
    }
    setLoadingRooms(true);
    getAvailableRooms(hotel.id, {
      date_arrivee: dates.arrival,
      date_depart: dates.departure,
      nombre_adultes: numAdults,
      nombre_enfants: 0,
    })
      .then((r) => setRooms(Array.isArray(r) ? r : []))
      .catch(() => setRooms([]))
      .finally(() => setLoadingRooms(false));
  }, [hotel?.id, dates.arrival, dates.departure, numAdults]);

  const handleSubmit = async () => {
    if (!hotel?.id) return;
    if (!dates.arrival || !dates.departure) {
      Alert.alert('Erreur', 'Veuillez renseigner les dates.');
      return;
    }
    if (rooms.length === 0) {
      Alert.alert('Erreur', 'Aucune chambre disponible pour ces dates. Choisissez d\'autres dates.');
      return;
    }
    const chambreId = rooms[0]?.id;
    if (!chambreId) {
      Alert.alert('Erreur', 'Aucune chambre sélectionnable.');
      return;
    }
    setLoading(true);
    try {
      const res = await createReservation({
        hotel_id: hotel.id,
        chambre_id: chambreId,
        date_arrivee: dates.arrival,
        date_depart: dates.departure,
        nombre_adultes: numAdults,
        nombre_enfants: 0,
      });
      const data = res?.data ?? res;
      const num = data?.numero_reservation || '—';
      Alert.alert('Réservation enregistrée', `Numéro: ${num}`, [
        { text: 'OK', onPress: () => navigation.navigate('MyReservations') },
      ]);
    } catch (e) {
      Alert.alert('Erreur', e.response?.data?.message || 'Impossible de créer la réservation.');
    } finally {
      setLoading(false);
    }
  };

  if (!hotel) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Hôtel manquant.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Réserver : {hotel.nom}</Text>
      <View style={styles.field}>
        <Text style={styles.label}>Date d'arrivée (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={dates.arrival}
          onChangeText={(t) => setDates((d) => ({ ...d, arrival: t }))}
          placeholder="2025-03-01"
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Date de départ (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={dates.departure}
          onChangeText={(t) => setDates((d) => ({ ...d, departure: t }))}
          placeholder="2025-03-05"
          placeholderTextColor="#888"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Nombre d'adultes</Text>
        <TextInput
          style={styles.input}
          value={guests}
          onChangeText={setGuests}
          keyboardType="number-pad"
          placeholder="1"
          placeholderTextColor="#888"
        />
      </View>
      {loadingRooms && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#7238D4" />
          <Text style={styles.loadingText}>Vérification des chambres...</Text>
        </View>
      )}
      {!loadingRooms && dates.arrival && dates.departure && (
        <Text style={styles.roomsInfo}>
          {rooms.length > 0 ? `${rooms.length} chambre(s) disponible(s)` : 'Aucune chambre pour ces dates'}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={loading || rooms.length === 0}
      >
        <Text style={styles.btnText}>{loading ? 'Envoi...' : 'Confirmer la réservation'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingTop: 48 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#49B9FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  error: { color: '#666' },
  link: { color: '#7238D4', marginTop: 12 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  loadingText: { color: '#666', fontSize: 14 },
  roomsInfo: { color: '#22c55e', fontSize: 14, marginBottom: 8 },
});
