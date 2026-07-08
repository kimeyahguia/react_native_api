import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../api/axiosConfig'; // Siguraduhing tama ang base URL nito (dapat gamit ang iyong Local IP, hindi 'localhost')

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Basic validation bago mag-send sa API
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill up all fields.');
      return;
    }

    setLoading(true);
    try {
      // Gumagawa ng POST request papunta sa backend
      const response = await api.post('/api/register', { name, email, password });
      
      if (response.data.success) {
        Alert.alert('Success', 'Account created! You can now log in.', [
          { text: 'OK', onPress: () => router.push('/auth/login') },
        ]);
      }
    } catch (error: any) {
      // Kinukuha ang error message mula sa backend kung mayroon
      const message = error.response?.data?.error || 'Something went wrong.';
      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Fullname"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[styles.registerButton, loading && styles.disabledButton]} 
          onPress={handleRegister} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para sa Android shadow
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  registerButton: {
    backgroundColor: '#14f31c', // Kulay green base sa original mo
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  disabledButton: {
    backgroundColor: '#a3fca6', // Mas maputlang green kapag loading
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#2f6fed',
    fontSize: 14,
  },
});