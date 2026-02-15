import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.email.trim() || !form.password) {
      Alert.alert('Erreur', 'Email et mot de passe requis.');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      await register({
        email: form.email.trim(),
        password: form.password,
        nom: form.nom || undefined,
        prenom: form.prenom || undefined,
        telephone: form.telephone || undefined,
      });
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } catch (e) {
      Alert.alert('Erreur', e.response?.data?.message || 'Inscription impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.box}>
          <Text style={styles.title}>Créer un compte</Text>
          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#888"
            value={form.email}
            onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe *"
            placeholderTextColor="#888"
            value={form.password}
            onChangeText={(t) => setForm((f) => ({ ...f, password: t }))}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#888"
            value={form.prenom}
            onChangeText={(t) => setForm((f) => ({ ...f, prenom: t }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#888"
            value={form.nom}
            onChangeText={(t) => setForm((f) => ({ ...f, nom: t }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            placeholderTextColor="#888"
            value={form.telephone}
            onChangeText={(t) => setForm((f) => ({ ...f, telephone: t }))}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? 'Inscription...' : 'S\'inscrire'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#A48374' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingVertical: 48 },
  box: { backgroundColor: '#fff', borderRadius: 20, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#7238D4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { color: '#7238D4', textAlign: 'center', marginTop: 16, fontSize: 14 },
});
