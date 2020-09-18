import React, { ButtonHTMLAttributes } from 'react';
import { FiLoader } from 'react-icons/fi'

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...otherProps }) => (
  <Container type="button" {...otherProps}>
    {
      loading ?
        <FiLoader size={24} />
      : children
    }
  </Container>
);

export default Button;
