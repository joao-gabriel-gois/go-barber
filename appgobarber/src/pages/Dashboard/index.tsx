import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { Provider } from '../types';

import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderAvailability,
  ProviderAvailabilityText,
  ProvidersListTitle,
} from './styles';

import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { user } = useAuth();
  const { navigate } = useNavigation();


  useEffect(() => {
    api
    .get('/providers')
    .then(response => {
      setProviders(response.data);
    })
  });

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToAppointmentCreation = useCallback((provider_id: string) => {
    navigate('AppointmentCreation', { provider_id });
  }, [navigate]);
  return (
    <Container>
      <Header>

        <HeaderTitle>Bem vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url}} />
        </ProfileButton>

      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={(provider) => provider.id}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer onPress={() => navigateToAppointmentCreation(provider.id)}>
            <ProviderAvatar source={{ uri: provider.avatar_url }} />
            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderAvailability>
                <Icon name="calendar" size={14} color="#FF9000" />
                <ProviderAvailabilityText>Segunda à Sexta</ProviderAvailabilityText>
              </ProviderAvailability>

              <ProviderAvailability>
                <Icon name="clock" size={14} color="#FF9000" />
                <ProviderAvailabilityText>Das 8h às 18h</ProviderAvailabilityText>
              </ProviderAvailability>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />

    </Container>
  )
};

export default Dashboard;
