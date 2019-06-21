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

const PersonaButtons = withStyles({
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

const StackedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

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
      personaIdentified: null,
      isAuthenticated: false,
    }
    this.updatePersona = this.updatePersona.bind(this);
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

  updatePersona(persona) {
    this.setState({
      personaIdentified: persona,
    });
  }

  render(){
    const { personaIdentified } = this.state; 

    const {isAuthenticated} = this.state;
    if(isAuthenticated){
      return(
        <Redirect to="./" />
      );
    } 

    console.log(this.state.personaIdentified);

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
              <TextBox text={personaIdentified === 'seeker' ? "Asylum Seeker" : "Service Provider"}/>
              <TextBox text="Sign Up"/>
                {personaIdentified === null  &&   
                  <StackedContainer>
                    <PersonaButtons onClick={this.updatePersona.bind(this, 'seeker')}>I'm an asylum seeker</PersonaButtons>            
                    <PersonaButtons onClick={this.updatePersona.bind(this, 'provider')}>I'm an Service Provider</PersonaButtons>          
                  </StackedContainer>
                 }
                 {personaIdentified !== null && 
                 <div>
                   <form onSubmit={this.handleSubmit}>
                     <InputStyle>
                       <Input type="username"
                       name="username"
 
                       onChange={this.handleChange}
                       value={this.state.username}
                       placeholder={personaIdentified === 'seeker' ? "Email*" : "Organization Email*"}/>
 
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
                 </div>
                 }
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
