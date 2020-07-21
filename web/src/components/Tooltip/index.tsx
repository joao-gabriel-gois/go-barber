import React from 'react';

import { Container } from './styles';

interface TootipProps {
  title: string;
  className?:string;
}

// className is required to allow heritance from input
// styled components at line 55

const Tootip: React.FC<TootipProps> = ({ title, className, children }) => {
  return (
    <Container className={className}>
      <span>{title}</span>
      {children}
    </Container>
  )
}

export default Tootip;
