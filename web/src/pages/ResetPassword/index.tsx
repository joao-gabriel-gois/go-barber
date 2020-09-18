import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

interface ResetPasswordFormData {
 password: string;
 password_confirmation: string;
}

const ResetPassword: React.FC = () => { 
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();
  const location = useLocation();

  const { addToast } = useToast();

  const handleSubmit = useCallback(async ({ password, password_confirmation }: ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string()
          .required('Senha obrigatória'),
        password_confirmation: Yup.string()
          .oneOf([Yup.ref('password'), undefined], 'As duas senhas informadas não são iguais'),
      });

      await schema.validate({ password, password_confirmation }, {
        abortEarly: false,
      });

      const token = location.search.replace('?token=', '');

      if(!token) {
        throw new Error('Do not know which user to reset the password')
      }

      await api.post('/password/reset', {
        token,
        password,
        password_confirmation,
      })

      history.push('/');
      
    } catch (err) {
      if (err instanceof Yup.ValidationError) {  
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao redefinir sua senha. Tente novamente.'
      });
    }
  }, [ history, addToast ]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Go Barber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu login</h1>

            <Input name="password" icon={FiLock} placeholder="Nova senha" type="password" />
            <Input name="password_confirmation" icon={FiLock} placeholder="Confirmação da a nova senha" type="password" />

            <Button type="submit">Alterar Senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
