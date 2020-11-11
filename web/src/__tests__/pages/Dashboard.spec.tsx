import React from 'react';
import { render, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Dashboard from '../../pages/Dashboard';

import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

const apiMock = new MockAdapter(api, {onNoMatch: 'throwException'});

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();
const mockedSignOut = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
  Link: ({ children }: { children: React.ReactNode }) => (
      <a href="/profile">{children}</a>
    ),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signOut: mockedSignOut,
      user: {
        id: 'some-id',
        name:'user-test-name',
      }
    }),
  };
});


describe('Dashboard Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    apiMock.reset();
  });

  it('should be able to move to profile page', () => {
    render(<Dashboard />);
     
    const linkComponent = screen.getByText('user-test-name').closest('a');
    
    // Final result for react-router-dom's Link Component
    expect(linkComponent).toHaveAttribute('href', '/profile');
  });

  it('should not be able to sign out', async () => {
    render(<Dashboard />);
    const buttonElement = screen.getByTestId('logout-button')

    fireEvent.click(buttonElement);

    expect(mockedSignOut).toHaveBeenCalledTimes(1);

  });

  it('should be able to update clicked day in state and use it to display in title', async () => {
    //To avoid false positive in case of test has being ran on any 18th day
    const currentDate = new Date();
    const dayToPick = currentDate.getDate() === 18 ? 19 : 18;

    render(<Dashboard />);

    const dayPickerTestingDay = screen.getByText(`${dayToPick}`);
    
    fireEvent.click(dayPickerTestingDay);
    
    const monthDayBasedSubtitle = screen.getByText('Horário Agendado').nextElementSibling?.children[0].innerHTML;
    const weekDayBasedSubtitle = screen.getByText('Horário Agendado').nextElementSibling?.children[1].innerHTML;

    const pickedDate = new Date(`${currentDate.getMonth() + 1}-${dayToPick}-${currentDate.getFullYear()}`);
    
    const weekDayName = format(pickedDate, 'cccc', { locale: ptBR });
    const monthName = format(pickedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });

    expect(monthDayBasedSubtitle).toEqual(monthName);
    expect(weekDayBasedSubtitle).toContain(weekDayName);
  });

  it('should be able to update clicked day in state and use it to call API which will check appointments', async () => {
    //To avoid false positive in case of test has being ran on any 18th day
    const currentDate = new Date();
    const dayToPick = currentDate.getDate() === 18 ? 19 : 18;
    const pickedDate = new Date(`${currentDate.getMonth() + 1}-${dayToPick}-${currentDate.getFullYear()}`);

    const apiResponse = [
      { 
        id: 'test-appointment-id',
        date: pickedDate.toISOString(),
        user: {
          id: 'test-user-id',
          name: 'John Barber',
          avatar_url: 'http://myserver.com/files/john-barber-profile-image.jpg',
        },
      }
    ];

    const apiQueryParams = {
      params: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: dayToPick,
      }
    };

    apiMock.onGet(
      'appointments/current-provider',
      apiQueryParams
    ).reply(200, apiResponse);

    const apiCallsSpy = jest.spyOn(api, 'get');
    
    render(<Dashboard />);

    const dayPickerTestingDay = screen.getByText(`${dayToPick}`);

    fireEvent.click(dayPickerTestingDay);
    
    // By clicking on any month 18 day it will set this day as a State,
    // and it will trigger one api call with this day in query param
    
    expect(apiCallsSpy).toHaveBeenLastCalledWith('appointments/current-provider', apiQueryParams);
    expect(apiCallsSpy).toHaveBeenCalledTimes(3); //2 useEffects by rendering + test API call
  
  });

  it('should be able to get response from API and render appointment in dashboard', async () => {
    //To avoid false positive in case of test has being ran on any 18th day
    const { user: currentUser } = useAuth();
    const currentDate = new Date();
    const dayToPick = currentDate.getDate() === 18 ? 19 : 18;
    const pickedDate = new Date(`${currentDate.getMonth() + 1}-${dayToPick}-${currentDate.getFullYear()}`);

    pickedDate.setHours(11);

    const firstApiResponse = [
      { 
        id: 'test-appointment-id',
        date: pickedDate.toISOString(),
        user: {
          id: 'test-user-id',
          name: 'John Barber',
          avatar_url: 'http://myserver.com/files/john-barber-profile-image.jpg',
        },
      }
    ];

    const secondApiResponse = [
      {
        day: 18,
        available: true
     },
     {
        day: 19,
        available: true
     },
    ]

    const firstApiQueryParams = {
      params: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: `${dayToPick}`,
      }
    };

    const secondApiQueryParams = {
      params: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
      }
    };
    
    apiMock.onGet(
      'appointments/current-provider',
      firstApiQueryParams
      ).reply(200, firstApiResponse)
      .onGet(
        `providers/${currentUser.id}/monthly-availability`,
        secondApiQueryParams
      )
    .reply(200, secondApiResponse);
        
        
    render(<Dashboard />);
    const dayPickerTestingDay = screen.getByText(`${dayToPick}`);
    
    fireEvent.click(dayPickerTestingDay);
    
    await waitForElementToBeRemoved(() => screen.queryByTestId('no-morning-appointment'));
      
    await waitFor(() => {
      expect(screen.getByTestId('appointment-list-item')).toBeInTheDocument();
      expect(screen.getByTestId('appointment-list-item').innerHTML).toEqual('John Barber');
    });
    
  });
});