import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/axiosConfig';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function WelcomeScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to load users.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh tuwing babalik dito yung screen (e.g. after register)
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const handleLogout = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeader}>Registered Members</Text>
      <Text style={styles.listLabel}>Users List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2f6fed" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.cell, styles.headerCell, { flex: 0.5 }]}>ID</Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 1.2 }]}>Name</Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 1.5 }]}>Email</Text>
          </View>

          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 0.5 }]}>{item.id}</Text>
                <Text style={[styles.cell, { flex: 1.2 }]}>{item.name}</Text>
                <Text style={[styles.cell, { flex: 1.5 }]}>{item.email}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}> No registered users yet.</Text>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#ed0a0a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  subHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  listLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  table: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    fontSize: 13,
    color: '#333',
  },
  headerCell: {
    fontWeight: '700',
    color: '#2f6fed',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 13,
  },
});