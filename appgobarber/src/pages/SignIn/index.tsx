import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  View,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logo from '../../assets/logo.png';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles';

const SignIn: React.FC = () => {
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex:1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logo} />

            <View>
              <Title>Faça seu login</Title>
            </View>

            <Input name="email" icon="mail" placeholder="E-mail" />
            <Input name="password" icon="lock" placeholder="Senha" />

            <Button onPress={() => {Alert.alert(`Sign In Button Pressed!`)}}>Entrar</Button>

            <ForgotPassword onPress={() => {Alert.alert('Forgot Password Button Pressed!')}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => {
        Alert.alert('Create Account Button Pressed!');
      }}>
        <Icon name="log-in" size={20} color="#FF9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  )
};

export default SignIn;
