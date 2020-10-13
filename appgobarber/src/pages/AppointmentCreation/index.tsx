import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, Platform } from 'react-native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Section,
  Schedule,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

import { Provider } from '../types';

interface RouteParams {
  provider_id: string;
}

interface DayAvailabilityItem {
  hour: number,
  available: boolean;
}

const AppointmentCreation: React.FC = () => {
  const { user } = useAuth()
  const { goBack, navigate } = useNavigation();
  const route = useRoute();

  const { provider_id } = route.params as RouteParams;

  const [ dailyAvailability, setDailyAvailability ] = useState<DayAvailabilityItem[]>([]);
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ selectedHour, setSelectedHour ] = useState(0);
  const [ showDatePicker, setShowDatePicker ] = useState(false);
  const [ providers, setProviders] = useState<Provider[]>([]);
  const [ selectedProvider, setSelectedProvider ] = useState(provider_id);


  useEffect(() => {
    api
    .get('/providers')
    .then(response => {
      console.log(response.data);
      setProviders(response.data);
    })
  }, []);

  useEffect(() => {
    api.get(`providers/${selectedProvider}/daily-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    }).then(response => {
      setDailyAvailability(response.data);
    });
  }, [selectedDate, selectedProvider])

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((selectedProviderId: string) => {
    setSelectedProvider(selectedProviderId);
    setSelectedHour(0);
    setSelectedDate(new Date());
  }, [setSelectedProvider]);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectedHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('CreatedAppointment', { date: date.getTime() });
    } catch(error) {
      Alert.alert(
        'Erro ao criar o agendamento',
        'Ocorreu um erro na tentativa de criação do agendamento. Tente novamente.'
      )
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return dailyAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [dailyAvailability])

  const afternoonAvailability = useMemo(() => {
    return dailyAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [dailyAvailability])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={ provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>Selecionar Data</OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              textColor="#F4EDE8"
              display="calendar"
              value={selectedDate}
              onChange={handleDateChange}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha um horário</Title>
          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({formattedHour, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={formattedHour}
                  onPress={() => handleSelectedHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>{formattedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(({formattedHour, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={formattedHour}
                  onPress={() => handleSelectedHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>{formattedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendamento</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
};

export default AppointmentCreation;
