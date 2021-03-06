import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

const Container = styled(RectButton)`
  height: 60px;
  background: #FF9000;
  border-radius: 10px;
  margin-top: 8px;

  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-family: 'RobotoSlabe-Medium';
  color: #312e38;
  font-size: 18px;
`;

export { Container, ButtonText };
