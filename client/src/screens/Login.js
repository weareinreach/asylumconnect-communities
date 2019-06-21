import React from 'react';
import styled from 'styled-components'
import TextBox from '../components/TextBox';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import  { Redirect } from 'react-router-dom'
import RainbowPaint from '../assets/rainbow-paint.jpg'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles';

const PageContainer =styled.div`
  display: flex;
  flex-direction: row;
  width:100vw;
  height:100vh;
`;
//login container
const LoginContainer = styled(PageContainer)`
  flex:2;
`;

const LoginFlexColumn = styled.div`
  display:flex;
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
  display:flex;
  flex-direction:column;
  justify-content: space-around;
  align: left;

`;

const InputStyle = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoginTitle = styled.div`
  font-size: 24px;
  font-family: Roboto;
  font-weight: bold;
`
const PrivacyNote = styled.div`
  padding: 20px 0px;
`

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

//image container
const ImageContainer = styled(PageContainer) `
  flex-basis:1;
  width:45%;
`;

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      // confirmPassword: '',
       isAuthenticated: false,
       RegistrationRedirect: false
    }
  }
  validateForm(response){
    if(this.state.username.length > 0 && this.state.password.length > 0){
    };
  }

  handleChange = e => {
   this.setState({
     [e.target.name] : e.target.value
   })
  }

  handleSubmit = event => {
    event.preventDefault();
    axios({
      url: '/api/login',
      method: 'post',
      data: {
        username: this.state.username,
        password: this.state.password,
      },
      }).then(response => {
        console.log(response);
        if( response.data.status === 'success' ){
          this.setState({
            isAuthenticated: true
          })
          window.location.href = "/Main";
        }
      })
  }

  render(){
    const { isAuthenticated} = this.state

    if(isAuthenticated) {
      return  (
        <Redirect to="/Main" />
      )
    }

    return(
        <PageContainer>
          <LoginContainer>
          </LoginContainer>
            <LoginFlexColumn>
              <LoginFlexNavBar>
                <Navbar/>
              </LoginFlexNavBar>
              <LoginFlexCenterPage>
                <LoginForm>
                  <LayoutLeft>
                      <LoginTitle>
                        <TextBox text= "AsylumConnect Community"/>
                      </LoginTitle>
                      <TextBox text="Log In"/>
                      <InputStyle>
                        <Input type="text" name="username" onChange={this.handleChange} placeholder="Email*"/>
                        <Input type="password" name="password" onChange={this.handleChange} placeholder="Password*"/>
                      </InputStyle>
                      <PrivacyNote>
                          <TextBox text={<p>By clicking Log In, you agree to <a href=''>One Degree's Privacy Policy</a> and <a href=''>Terms of Use</a>.</p>} />
                      </PrivacyNote>
                      <LoginButton onClick={this.handleSubmit}>Login</LoginButton>
                      <div>
                        <a href='Registration'>Forgot Passoword?</a>| 
                        <a href='Registration'>Sign up for an Account</a>
                        </div>
                  </LayoutLeft>
                </LoginForm>
              </LoginFlexCenterPage>
            </LoginFlexColumn>
          <ImageContainer>
              <img src={RainbowPaint} alt="sideImage"/>

          </ImageContainer>
        </PageContainer>
      );
      }
  }

export default LoginScreen;