import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StatusBar } from 'react-native';

import Routes from './routes';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312e38" />
    <SafeAreaView style={{flex: 1, backgroundColor: '#312e38'}}>
      <Routes />
    </SafeAreaView>
  </NavigationContainer>
);

export default App;
