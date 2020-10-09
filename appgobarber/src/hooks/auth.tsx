import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect
} from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthDataState {
  token: string;
  user: User;
}

interface SignInCretendtials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCretendtials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthDataState>({} as AuthDataState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData(): Promise<void> {
      const [ currentToken, currentUser ] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user'
      ]); // return an array of key-value pair arrays

      if (currentToken[1] && currentUser[1]) {
        api.defaults.headers.authorization = `Bearer ${currentToken[1]}`;

        setAuthData({
          token: currentToken[1],
          user: JSON.parse(currentUser[1]),
        })
      }

      setLoading(false);
    }
    loadStoragedData();
  }, []);


  const signIn = useCallback(async ({ email, password }: SignInCretendtials ) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)]
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setAuthData({ token, user });
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      '@GoBarber:token',
      '@GoBarber:user'
    ]);

    setAuthData({} as AuthDataState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: authData.user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context;
}

export { AuthProvider, useAuth };
