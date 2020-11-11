import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../../hooks/auth';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'test-user-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'test-user-token',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', apiResponse.token);
    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:user', JSON.stringify(apiResponse.user));
    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to get localStorage info when auth hook is called', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch(key) {
        case '@GoBarber:token':
          return 'test-user-token';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'test-user-id',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch(key) {
        case '@GoBarber:token':
          return 'test-user-token';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'test-user-id',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'test-user-id',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'avatar_url.jpg',
    };

    act(() => {
      result.current.updateUser(user)
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user)
    );

    expect(result.current.user).toEqual(user);
  });
})