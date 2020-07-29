import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

const Container = styled.View`
  flex:1;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
`;

const Title = styled.Text`
  font-size: 24px;
  color: #F4EDE8;
  font-family: 'RobotoSlab-Medium';
  margin: 64px 0 24px;
`;

const ForgotPassword = styled.TouchableOpacity`
  margin-top: 24px;
`;

const ForgotPasswordText = styled.Text`
  color: #F4EDE8;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

const CreateAccountButton = styled.TouchableOpacity`
  position:absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background: #312E38;
  border-top-width: 1px;
  border-color: #322129;
  padding: 16px 0 ${16 + getBottomSpace()}px;

  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const CreateAccountButtonText = styled.Text`
  color: #FF9000;
  font-size: 18px;
  font-family: 'RobotoSlabe-Regular'
`;

export {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
};