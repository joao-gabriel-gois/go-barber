import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';

import { ToastMessage } from '../../hooks/toast';
import { Container } from './styles';


interface ToastContainerProps {
  alerts: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ alerts }) => {
  const alertsWithTransition = useTransition(
    alerts,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 }
    }
  )
  return (
    <Container>
      {
        alertsWithTransition.map(({ item, key, props} ) => (
          <Toast key={key} style={props} message={item} />
        ))
      }
    </Container>
  );
}

export default ToastContainer;