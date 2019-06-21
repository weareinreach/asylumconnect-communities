import React from 'react';
import  { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../components/Navbar'
import RainbowPaint from '../assets/rainbow-paint.jpg'
import TextBox from '../components/TextBox';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
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

const RegistrationFlexCenterPage = styled(LoginFlexCenterPage)`
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

const SignUpButton = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
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
class RegistrationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      isAuthenticated: false,
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  handleSubmit = event => {
    console.log('hello');
    event.preventDefault();
    axios({
      url: '/api/signup',
      method: 'post',
      data: {
        username: this.state.username,
        password: this.state.password,
      },
      })
      .then(response => {
        console.log(response);
        if( response.data.status === 'success' ){
          this.setState({
            isAuthenticated: true
          });
        }
      })
  }
  validateForm(){
    return(this.state.username.length > 0 &&
      this.state.password.length > 0 &&
      this.state.confirmPassword.length > 0 );
  }

  render(){
    const {isAuthenticated} = this.state;
    if(isAuthenticated){
      return(
        <Redirect to="./" />
      );
    }
    return(
      <PageContainer>
      <LoginContainer>
      </LoginContainer>
        <LoginFlexColumn>
          <LoginFlexNavBar>
            <Navbar/>
          </LoginFlexNavBar>
          <RegistrationFlexCenterPage>

            <LayoutLeft>
              <TextBox text= "AsylumConnect Community"/>
              <TextBox text="Registration"/>


                <form onSubmit={this.handleSubmit}>
                  <InputStyle>
                    <Input type="username"
                    name="username"

                    onChange={this.handleChange}
                    value={this.state.username}
                    placeholder="Username"/>

                    <Input type="password"
                    name="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    placeholder="Password"/>

                    <Input type="Password"
                    name="confirmPassword"
                    onChange={this.handleChange}
                    value={this.state.confirmPassword}
                    placeholder="ConfirmPassword"/>
                  </InputStyle>

                  <SignUpButton
                  disabled={!this.validateForm}
                  type="submit">
                  Submit
                  </SignUpButton>
                </form>

              <Button href='./'>Go Back to Login</Button>
            </LayoutLeft>
          </RegistrationFlexCenterPage>
        </LoginFlexColumn>
      <ImageContainer>
          <img src={RainbowPaint} alt="sideImage"/>
      </ImageContainer>
    </PageContainer>
    );
  }
}
export default RegistrationScreen;


/*
<form onSubmit={this.handleSubmit}>

                  <FormGroup>
                    <FormControlLabel>Email</FormControlLabel>
                    <FormControl
                    value={this.state.email}
                    onChange={this.state.email}
                    type = "email"

                    />
                  </FormGroup>

                  <FormGroup>
                    <FormControlLabel>Password</FormControlLabel>

                    <FormControl
                    value ={this.state.password}
                    onChange={this.state.password}
                    type = "password"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormControlLabel>ConfirmPassword</FormControlLabel>

                    <FormControl
                    value ={this.state.confirmPassword}
                    onChange={this.state.confirmPassword}
                    type = "confirmPassword"
                    />
                  </FormGroup>

                  <Button
                    disabled={!this.validateForm}
                    type="submit">
                    Submit
                  </Button>
                </form>

*/
