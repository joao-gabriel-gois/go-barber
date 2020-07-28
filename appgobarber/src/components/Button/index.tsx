import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  children: string; // forcing to be required
}

const Button: React.FC<ButtonProps> = ({ children, ...otherProps }) => (
  <Container {...otherProps}>
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
