import React, { ChangeEvent, useCallback, useRef } from 'react';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  new_password: string;
  password_confirmation: string;
 }

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();
  
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async ({ name, email, password, new_password, password_confirmation }: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string()
            .required('Nome é obrigatório'),
          email: Yup.string()
            .required('Email é obrigatório')
            .email('Digite um email válido'),
          password: Yup.string(),
          new_password: Yup.string().when('password', {
            is: value => !!value.length,
            then: Yup.string()
              .min(6, 'Necessário no mínimo 6 caractéres')
              .required('Campo Obigratório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().when('password', {
            is: value => !!value.length,
            then: Yup.string()
              .min(6, 'Necessário no mínimo 6 caractéres')
              .required('Campo Obrigatório'),
            otherwise: Yup.string(),
          }).oneOf(
            [Yup.ref('new_password'), undefined],
            'As duas senhas informadas não são iguais'
          ),
        });

        await schema.validate({ name, email, password, new_password, password_confirmation }, {
          abortEarly: false,
        });

        const formData = {
          name,
          email,
          ... (password
            ? {
                password,
                new_password,
                password_confirmation
              }
            : {}
          ),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso',
          description: 'As novas informações já estão associadas ao seu perfil.'
        });

        setTimeout(()=> {
          history.push('/');
        }, 2000);

      } catch (err) {
        if (err instanceof Yup.ValidationError) {  
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        const statusCode = err.message.split('code ')[1] === '401';

        if (statusCode) {
          formRef.current?.setErrors({
            password: 'Senha incorreta',
          });

          addToast({
            type: 'error',
            title: 'Erro na atualização',
            description: 'A senha informada está incorreta. Tente novamente preenchendo o campo referente a senha antiga corretamente.',
          });

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Não foi possível realizar a atualização de seu perfil. Tente novamente mais tarde.',
        });
      }
    }
  , [history, addToast, updateUser]);

  const handleAvatarChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => { 
    if (event.target.files) {
      const data = new FormData();
  
      data.append('avatar', event.target.files[0]);

      api.patch('/users/avatar', data)
        .then(response => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Foto de perfil atualizada!',
            description: 'Agora você já está utilizando a nova foto de perfil',
          })
        }).catch(error => {
          addToast({
            type: 'error',
            title: 'Não foi possível atualizar foto de perfil',
            description: 'Algo deu errado na tentativa de atualizar sua foto de perfil. Tente novamente.'
          })

          console.error(error ? error : 'Motivo desconhecido!')
        });
    }
  } , [addToast, updateUser]);

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form 
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name}/>
            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>
          

          <Input name="name" icon={FiUser} placeholder="Insira seu name" type="text" />

          <Input name="email" icon={FiMail} placeholder="Insira seu email" type="email" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="password"
            icon={FiLock}
            placeholder="Antiga Senha"
            type="password"
          />

          <Input
            name="new_password"
            icon={FiLock}
            placeholder="Nova Senha"
            type="password"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            placeholder="Confirme a nova senha"
            type="password"
          />

          <Button type="submit">Confirmar Mudanças</Button>
        </Form>
      </Content>
    </Container>
  )
};

export default Profile;
