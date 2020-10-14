import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  font-size: 32px;
  color: #F4EDE8;
  font-family: 'RobotoSlab-Medium';
  margin-top: 28px;
  text-align: center;
`;

export const Description = styled.Text`
  font-family: 'RobotoSlab-Regular';
  font-size: 15px;
  color: #999591;
  margin-top: 24px;
`;

export const OkButton = styled(RectButton)`
  background: #FF9000;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 48px;
  padding: 12px 24px;
`;

export const OkButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #312E28;
  font-size: 18px;
`;

