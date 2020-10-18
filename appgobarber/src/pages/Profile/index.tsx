import React, { useRef, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  View,
  Platform,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
  LogOut,
  LogOutText,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  new_password: string;
  password_confirmation: string
}

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null );
  const newPasswordInputRef = useRef<TextInput>(null );
  const passwordConfirmationInputRef = useRef<TextInput>(null );
  const navigation = useNavigation();


  const handleProfileUpdate = useCallback(
    async ({
      name,
      email,
      password,
      new_password,
      password_confirmation
    }: ProfileFormData) => {
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

        Alert.alert('Perfil Atualizado!', 'As alterações já foram realizadas');

        navigation.goBack();

      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        console.log(err, err.message);

        Alert.alert('Erro na atualização do perfil', 'Não foi possível aplicar as alterações, tente novamente.');
      }
    },
  [navigation, updateUser]);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker({
      title: 'Selecione uma imagem de perfil',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Usar Câmera',
      chooseFromLibraryButtonTitle: 'Escolher da galeria',
    }, response => {
      if (response.didCancel) {
        return;
      }

      if (response.error) {
        Alert.alert('Erro ao atualizar seu avatar', 'Não foi possível acessar o arquivo, tente novamente.');
        return;
      }

      const data = new FormData();

      data.append('avatar', {
        type: 'image/jpeg',
        name: `${user.id}.jpg`,
        uri: response.uri,
      })

      api.patch('/users/avatar', data).then(apiResponse => {
        updateUser(apiResponse.data);
      });

    })
  }, [updateUser, user.id]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation])

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps='handled'
        style={{ flex: 1 }}
      >
        <Container>
          <BackButton onPress={handleGoBack}>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>

          <UserAvatarButton onPress={handleUpdateAvatar}>
            <UserAvatar source={{ uri: user.avatar_url }}/>
          </UserAvatarButton>

          <View>
            <Title>Meu perfil</Title>
          </View>

          <Form
            ref={formRef}
            onSubmit={handleProfileUpdate}
            initialData={user}
          >

            <Input
              name="name"
              icon="user"
              autoCapitalize="words"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />

            <Input
              ref={emailInputRef}
              name="email"
              icon="mail"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />

            <Input
              ref={passwordInputRef}
              name="password"
              icon="lock"
              containerStyle={{ marginTop:  16 }}
              secureTextEntry
              autoCapitalize="none"
              textContentType="newPassword"
              placeholder="Senha atual"
              returnKeyType="next"
              onSubmitEditing={() => {
                newPasswordInputRef.current?.focus();
              }}
            />

            <Input
              ref={newPasswordInputRef}
              name="new_password"
              icon="lock"
              secureTextEntry
              autoCapitalize="none"
              textContentType="newPassword"
              placeholder="Nova enha"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordConfirmationInputRef.current?.focus();
              }}
            />

            <Input
              ref={passwordConfirmationInputRef}
              name="password_confirmation"
              icon="lock"
              secureTextEntry
              autoCapitalize="none"
              textContentType="newPassword"
              placeholder="Confirme a nova senha"
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm()
              }}
            />


            <Button
              onPress={() => formRef.current?.submitForm() }
            >
              Confirmar mudanças
            </Button>
          </Form>
          <LogOut onPress={signOut}>
            <Icon name="x-circle" size={20} color="#FF9000" />
            <LogOutText>Sair do GoBarber</LogOutText>
          </LogOut>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  )
};

export default Profile;
