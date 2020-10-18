import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

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

export const LogOut = styled.TouchableOpacity`
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

export const LogOutText = styled.Text`
  margin-left: 8px;
  color: #FF8B10;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
`;
