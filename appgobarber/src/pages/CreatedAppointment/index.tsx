import React from 'react';
import { View, Button, Alert } from 'react-native';

const CreatedAppointment: React.FC = () => {

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Button title="Create Appointment" onPress={() => Alert.alert('Create Appointment Screen')} />
    </View>
  )
};

export default CreatedAppointment;
