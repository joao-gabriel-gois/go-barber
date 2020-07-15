import React from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'

import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Content, Background } from './styles';

import logoImg from '../../assets/logo.svg';

const SignIn: React.FC = () => (
  <Container>
    <Content>
      <img src={logoImg} alt="Go Barber" />
      <form>
        <h1>Faça seu login</h1>

        <Input name="email" icon={FiMail} placeholder="Insira seu email" type="email" />

        <Input name="password" icon={FiLock} placeholder="Senha" type="password" />

        <Button type="submit">Entrar</Button>

        <a href="/forgot">Esqueci minha senha</a>
      </form>

      <a href="create">
        <FiLogIn />
        Criar conta
      </a>
    </Content>
    <Background />
  </Container>
);

export default SignIn;
