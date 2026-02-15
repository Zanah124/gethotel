import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getHotelById, getAvailableRooms } from '../services/hotelService';
import { getHotelImageUrl } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';

export default function HotelDetailScreen({ route, navigation }) {
  const { hotel: initialHotel } = route.params || {};
  const { user } = useAuth();
  const [hotel, setHotel] = useState(initialHotel || null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(!initialHotel);

  useEffect(() => {
    if (initialHotel?.id && !initialHotel.description) {
      getHotelById(initialHotel.id).then(setHotel).catch(() => setHotel(initialHotel));
    } else {
      setHotel(initialHotel);
    }
    if (initialHotel?.id) {
      getAvailableRooms(initialHotel.id).then((r) => setRooms(Array.isArray(r) ? r : [])).catch(() => setRooms([]));
    }
    setLoading(false);
  }, [initialHotel?.id]);

  const handleReserve = () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('Booking', { hotel: hotel || initialHotel });
  };

  if (loading || !hotel) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#7238D4" />
      </View>
    );
  }

  const imageUri = hotel.photo_principale ? getHotelImageUrl(hotel.photo_principale) : 'https://via.placeholder.com/400x240?text=Hôtel';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title}>{hotel.nom}</Text>
        <Text style={styles.location}>{hotel.ville}, {hotel.pays}</Text>
        <Text style={styles.stars}>⭐ {hotel.nombre_etoiles || '—'} étoiles</Text>
        {hotel.description ? (
          <Text style={styles.desc}>{hotel.description}</Text>
        ) : null}
        {rooms.length > 0 && (
          <Text style={styles.roomsTitle}>{rooms.length} type(s) de chambre disponible(s)</Text>
        )}
        <TouchableOpacity style={styles.btn} onPress={handleReserve}>
          <Text style={styles.btnText}>Réserver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 240, backgroundColor: '#eee' },
  body: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  location: { color: '#666', fontSize: 16, marginBottom: 4 },
  stars: { color: '#b8860b', marginBottom: 16 },
  desc: { color: '#444', lineHeight: 22, marginBottom: 20 },
  roomsTitle: { color: '#666', marginBottom: 16 },
  btn: {
    backgroundColor: '#49B9FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
