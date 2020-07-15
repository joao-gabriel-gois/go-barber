import React, { InputHTMLAttributes, ReactComponentElement } from 'react';
import { IconBaseProps } from 'react-icons'

import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({icon: Icon, ...otherProps}) => (
  <Container>
    { Icon && <Icon size={20} /> }
    <input {...otherProps} />
  </Container>
  );

export default Input;
