import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

const Container = styled.View`
  margin-top: 21px;
  flex:1;
  align-items: center;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

const Title = styled.Text`
  font-size: 24px;
  color: #F4EDE8;
  font-family: 'RobotoSlab-Medium';
  margin: 64px 0 24px;
`;

const BackToSignIn = styled.TouchableOpacity`
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

const BackToSignInText = styled.Text`
  color: #FFF;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
`;

export {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText
};
