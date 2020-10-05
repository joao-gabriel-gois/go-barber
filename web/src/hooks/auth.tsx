import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

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
  signIn(credentials: SignInCretendtials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthDataState>(() => {
    const currentToken = localStorage.getItem('@GoBarber:token');
    const currentUser = localStorage.getItem('@GoBarber:user');

    if (currentToken && currentUser) {
      api.defaults.headers.authorization = `Bearer ${currentToken}`;
      
      return {
        token: currentToken,
        user: JSON.parse(currentUser),
      };
    }


    return {} as AuthDataState;
  })

  const signIn = useCallback(async ({ email, password }: SignInCretendtials ) => {
    const response = await api.post('sessions', {
      email,
      password,
    });
    
    console.log(response.data);
    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setAuthData({ token, user });
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setAuthData({} as AuthDataState);
  }, []);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));
    
    setAuthData({
      token: authData.token,
      user,
    });
  }, [setAuthData, authData.token]);

  return (
    <AuthContext.Provider value={{ user: authData.user, signIn, signOut, updateUser }}>
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
