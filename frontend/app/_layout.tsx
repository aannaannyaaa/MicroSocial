import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { Loading } from '../src/components/Loading';       

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
      </Stack>
    </AuthProvider>
  );
}
