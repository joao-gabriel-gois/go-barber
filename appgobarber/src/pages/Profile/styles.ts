import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex:1;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 64px;
  z-index: 1;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #F4EDE8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
  text-align: left;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: -24px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;



