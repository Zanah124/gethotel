import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { getHotels } from '../services/hotelService';
import { getHotelImageUrl } from '../utils/imageUtils';

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getHotels(search);
      setHotels(Array.isArray(data) ? data : []);
    } catch (e) {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HotelDetail', { hotel: item })}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.photo_principale ? getHotelImageUrl(item.photo_principale) : 'https://via.placeholder.com/400x240?text=Hôtel' }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.nom}</Text>
        <Text style={styles.cardLocation}>{item.ville}, {item.pays}</Text>
        <Text style={styles.cardStars}>⭐ {item.nombre_etoiles || '—'} étoiles</Text>
        <TouchableOpacity
          style={styles.cardBtn}
          onPress={() => navigation.navigate('HotelDetail', { hotel: item })}
        >
          <Text style={styles.cardBtnText}>Voir & Réserver</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trouver un hôtel</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Ville ou nom..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={load}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={load}>
            <Text style={styles.searchBtnText}>Rechercher</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#7238D4" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Aucun hôtel trouvé.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#A48374' },
  header: { padding: 16, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: '#7238D4',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 12,
  },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  list: { padding: 16, paddingTop: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: { width: '100%', height: 180 },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  cardLocation: { color: '#666', fontSize: 14, marginBottom: 4 },
  cardStars: { color: '#b8860b', fontSize: 14, marginBottom: 12 },
  cardBtn: {
    backgroundColor: '#49B9FF',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardBtnText: { color: '#000', fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 12 },
  empty: { color: '#fff', textAlign: 'center', marginTop: 24, fontSize: 16 },
});
