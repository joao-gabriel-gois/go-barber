import React from 'react';

import GlobalStyle from './styles/global';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <SignIn />
      </AuthProvider>
      <GlobalStyle />
    </>
  );
}

export default App;
