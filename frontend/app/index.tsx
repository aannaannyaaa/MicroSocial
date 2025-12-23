import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Loading } from '../src/components/Loading';

export default function Index() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <Redirect 
      href={isSignedIn ? '/feed' : '/login'} 
    />
  );
}
