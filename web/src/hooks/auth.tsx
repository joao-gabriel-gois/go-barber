import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface AuthDataState {
  token: string;
  user: object;
}

interface SignInCretendtials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCretendtials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthDataState>(() => {
    const currentToken = localStorage.getItem('@GoBarber:token');
    const currentUser = localStorage.getItem('@GoBarber:user');

    if (currentToken && currentUser) {
      return {
        token: currentToken,
        user: JSON.parse(currentUser),
      };
    }

    return {} as AuthDataState;
  })

  const signIn = useCallback(async ({ email, password }: SignInCretendtials ) => {
    const response = await api.post('session', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    setAuthData({ token, user });
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setAuthData({} as AuthDataState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: authData.user, signIn, signOut }}>
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