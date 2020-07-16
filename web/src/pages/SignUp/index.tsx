import React from 'react';
import { FiArrowLeft, FiMail, FiUser,FiLock, FiArrowLeft } from 'react-icons/fi'

import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Content, Background } from './styles';

import logoImg from '../../assets/logo.svg';

const SignUp: React.FC = () => (
  <Container>
    <Background />
    <Content>
      <img src={logoImg} alt="Go Barber" />
      <form>
        <h1>Faça seu login</h1>

        <Input name="name" icon={FiUser} placeholder="Insira seu name" type="text" />

        <Input name="email" icon={FiMail} placeholder="Insira seu email" type="email" />

        <Input name="password" icon={FiLock} placeholder="Senha" type="password" />

        <Button type="submit">Cadastrar</Button>
      </form>

      <a href="create">
        <FiArrowLeft />
        Voltar para login
      </a>
    </Content>
  </Container>
);

export default SignUp;
