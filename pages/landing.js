import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import TextBox from '../components/TextBox';
import Navbar from '../components/Navbar';

import styles from './styles/landing.css';

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
`;

const LoginContainer = styled(PageContainer)`
  flex: 2;
`;

const LoginFlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const LoginFlexNavBar = styled(LoginFlexColumn)`
  display: flex;
  flex: 1;
`;

const LoginFlexCenterPage = styled(LoginFlexColumn)`
  flex: 8;
`;

const LoginForm = styled(LoginFlexCenterPage)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LayoutLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align: left;
`;

const LoginTitle = styled.div`
  font-size: 24px;
  font-family: Roboto;
  font-weight: bold;
`;

const LoginButton = withStyles({
  root: {
    background: '#cc4747',
    borderRadius: 100,
    border: 0,
    color: 'white',
    height: 56,
    padding: '0 30px',
    fontSize: '16px',
    width: '300px',
    margin: '32px auto',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

const RegisterButton = withStyles({
  root: {
    background: '#cc4747',
    borderRadius: 100,
    border: 0,
    color: 'white',
    height: 56,
    padding: '0 30px',
    fontSize: '16px',
    width: '300px',
    margin: '32px auto',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

//image container
const ImageContainer = styled(PageContainer)`
  flex-basis: 1;
  width: 45%;
`;

export default () => (
  <PageContainer>
    <style jsx>{styles}</style>
    <LoginContainer />
    <LoginFlexColumn>
      <LoginFlexNavBar>
        <Navbar />
      </LoginFlexNavBar>
      <LoginFlexCenterPage>
        <LoginForm>
          <LayoutLeft>
            <LoginTitle>
              <TextBox text='AsylumConnect Community' />
            </LoginTitle>
            <TextBox className='test' text='A private online community for LGBTQ asylum seekers, asylees, lawyers, and other relevant service providers.' />
            <RegisterButton href='Registration'>Sign Up</RegisterButton>
            <LoginButton href='Login'>Log In</LoginButton>
          </LayoutLeft>
        </LoginForm>
      </LoginFlexCenterPage>
    </LoginFlexColumn>
    <ImageContainer>
      <img src={`/static/rainbow-paint.jpg`} alt='sideImage' />
    </ImageContainer>
  </PageContainer>
);
