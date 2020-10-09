import React from 'react';
import { View, Button, Alert } from 'react-native';

const AppointmentCreation: React.FC = () => {

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Button title="Appointment Creation" onPress={() => Alert.alert('Appointment Creation Screen')} />
    </View>
  )
};

export default AppointmentCreation;
