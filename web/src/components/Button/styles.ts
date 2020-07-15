import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #FF9000;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 16px;
  color: #312E38;
  width: 100%;
  font-weight: 500;
  margin-top: 16px;

  &:hover {
    background: ${shade(0.2, '#FF9000')}
  }
`;
