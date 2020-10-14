import React, { useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

const CreatedAppointment: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const routeParams = params as RouteParams;

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [
        { name: 'Dashboard' },
      ],
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    const rawFormattedDate = format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy', às' HH:mm'h'",
      { locale: ptBr },
    );

    // Captilizing week day
    const formattedDateChars = rawFormattedDate.split('');
    formattedDateChars[0] = formattedDateChars[0].toUpperCase();
    const finalFormattedDate = formattedDateChars.join('');

    return finalFormattedDate;

  }, [])

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento Concluído</Title>

      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOkPressed}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  )
};

export default CreatedAppointment;
