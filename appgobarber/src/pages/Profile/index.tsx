import React from 'react';
import { View, Button, Alert } from 'react-native';

const Profile: React.FC = () => {

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Button title="Profile" onPress={() => Alert.alert('Profile Screen')} />
    </View>
  )
};

export default Profile;
