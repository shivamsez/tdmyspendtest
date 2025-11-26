import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState(null);

  const handleStart = () => {
    if (input) {
      let targetUrl = input.trim();
      
      // If it looks like just an IP (e.g., 192.168.1.5), add http:// and port
      // Regex checks for roughly "number.number..."
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(targetUrl)) {
        targetUrl = `http://${targetUrl}:8000`;
      } 
      // If it doesn't start with http/https, assume http
      else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `http://${targetUrl}`;
      }
      
      setUrl(targetUrl);
    }
  };

  const handleBack = () => {
    setUrl(null);
  };

  if (url) {
    return (
      <SafeAreaView style={styles.webviewContainer}>
        <StatusBar barStyle="dark-content" />
        <WebView 
          source={{ uri: url }} 
          style={{ flex: 1 }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            alert(`Failed to load ${url}.\n\nError: ${nativeEvent.description}`);
            setUrl(null);
          }}
          renderError={(errorName) => (
             <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading page</Text>
                <Text style={styles.errorSubText}>{errorName}</Text>
                <Button title="Go Back" onPress={handleBack} color="#008a00" />
             </View>
          )}
        />
        <View style={styles.floatingButton}>
          <Button title="Reset" onPress={handleBack} color="#008a00" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>TD MySpend Mobile</Text>
        <Text style={styles.subtitle}>Connect to your computer</Text>
        
        <Text style={styles.label}>Enter IP or URL:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 10.0.0.209"
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.hint}>
          Default Local IP: 10.0.0.209
          {'\n'}
          If that fails, try using a tunnel URL.
        </Text>

        <Button title="Connect" onPress={handleStart} color="#008a00" disabled={!input} />
        
        <View style={styles.spacer} />
        
        <View style={styles.troubleshootBox}>
           <Text style={styles.troubleshootTitle}>Troubleshooting:</Text>
           <Text style={styles.troubleshootText}>1. Ensure phone & computer are on same Wi-Fi.</Text>
           <Text style={styles.troubleshootText}>2. Check computer firewall isn't blocking python.</Text>
           <Text style={styles.troubleshootText}>3. Allow "Local Network" access on iOS.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008a00',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 24,
    lineHeight: 18,
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#008a00',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  troubleshootBox: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  troubleshootTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#006000',
    marginBottom: 8,
  },
  troubleshootText: {
    fontSize: 12,
    color: '#006000',
    marginBottom: 4,
  }
});
