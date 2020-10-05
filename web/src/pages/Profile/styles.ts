import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  > header {
    display: flex;
    align-items: center;

    height: 144px;
    background: #28262E;
    transition: background-color 0.2s;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      
      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }

      &:hover {
        opacity: 0.7;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -176px auto 0;

  width: 100%;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }

    a {
      color: #F4EDE8;
      display: block;
      margin-top: 24px;
      text-decoration: none;

      &:hover {
        color: ${shade(0.2, '#F4EDE8')}
      }
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 48px;
    height: 48px;
    background: #FF9000;
    border-radius: 50%;
    border:0;
    cursor: pointer;
    transition: background-color 0.2s;

    input {
      display: none;
    }

    svg {
      color: #312E38;
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: ${shade(0.2, '#FF9000')}    
    }
  }
`;
