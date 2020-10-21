import React from 'react';
import { render, fireEvent, getByTestId, waitFor } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input component', () => {
  it('should be able to render an Input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="email" />
    );

    expect(getByPlaceholderText('email')).toBeTruthy();
  });


  it('should highlight input when it gets focused', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="email" />
    );
    
    const inputElement = getByPlaceholderText('email');
    const inputContainerElement = getByTestId('input-container');
    
    fireEvent.focus(inputElement);
    
    await waitFor(() => {
      expect(inputContainerElement).toHaveStyle('border-color: #FF9000;');
      expect(inputContainerElement).toHaveStyle('color: #FF9000;');
    });
  });


  it('should remove input highlight when it is not focused anymore', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="email" />
    );
    
    const inputElement = getByPlaceholderText('email');
    const inputContainerElement = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await waitFor(() => {
      expect(inputContainerElement).toHaveStyle('border-color: #FF9000;');
      expect(inputContainerElement).toHaveStyle('color: #FF9000;');
    });
    
    fireEvent.blur(inputElement);
    
    await waitFor(() => {
      expect(inputContainerElement).not.toHaveStyle('border-color: #FF9000;');
      expect(inputContainerElement).not.toHaveStyle('color: #FF9000;');
    });
  });


  it('should keep input highlight when it has value (filled)', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="email" />
    );
    
    const inputElement = getByPlaceholderText('email');
    const inputContainerElement = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'johndoe@example.com.br' },
    })
    
    fireEvent.blur(inputElement);
    
    await waitFor(() => {
      expect(inputContainerElement).toHaveStyle('color: #FF9000;');
    });
  });
});
