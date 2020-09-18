import React, { useState, useRef, useCallback } from 'react';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

interface ForgotPasswordFormData {
 email: string;
}

const ForgotPassword: React.FC = () => {
  const [ loading, setLoading ] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(async ({ email }: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('Email é obrigatório')
          .email('Digite um email válido'),
      });

      await schema.validate({
          email
        },
        {
          abortEarly: false,
      });

    await api.post('/password/forgot', {
      email,
    });

    addToast({
      type: 'success',
      title: 'Email de recuperação de senha enviado',
      description: 'Cheque sua inbox para receber as instruções de como recuperar sua senha',
    })
      
    } catch (err) {
      if (err instanceof Yup.ValidationError) {  
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na recuperação de senha',
        description: 'Algo deu errado no momento de recuperar a senha, tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  },  [ addToast ]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Go Barber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar Senha</h1>

            <Input name="email" icon={FiMail} placeholder="Insira seu email" type="email" />

            <Button loading={loading} type="submit">Recuperar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para o login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
