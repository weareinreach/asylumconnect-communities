import React from 'react'
//import Avatar from'@material-ui/core/Avatar'
import styled from 'styled-components'
import Logo from '../assets/AsylumConnectLogo.png'
import {NavLink}  from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { NONAME } from 'dns';


const NavbarArea  = styled.div`
  width: 100%;
  padding: 8px 0;
`;

const NavFlexbox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
`;

const NavItems = styled.div`
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  a{
    color: rgba(0, 0, 0, 0.87);
  }

`;
const NavButton = withStyles({
  root: {
    background: 'white',
    borderRadius: 100,
    border: '2px solid',
    borderColor: '#5073B3',
    height: '30px',
    padding: '0 30px',
    fontSize: '16px',
    width: 'auto',
    margin: '15px auto',
    '&:hover': {
      backgroundColor: "#334A7C",
      borderColor: '#334A7C',

    },
    '&:hover a': {
        color: 'white',
        textDecoration: 'none',
    }
  },
  label: {
    textTransform: 'capitalize',
  },

})(Button);

const NavLogo = styled.div`
  img {
    width: 45px;
  }
`;

const Navbar = () =>{

  return(
      <NavbarArea>
        <NavFlexbox>

          <NavLogo>
          <img src={Logo}/>
            </NavLogo>
          <NavItems>
            <NavLink to="/"> ABOUT US</NavLink>
          </NavItems>

          <NavItems>
            <NavLink to="/"> TAKE ACTION</NavLink>
          </NavItems>

          <NavItems>
            <NavLink to="/"> GET HELP</NavLink>
          </NavItems>

          <NavItems>
            <NavLink to="/"> CONTACT US</NavLink>
          </NavItems>

          <NavItems>
            <NavButton>
            <NavLink to="/"> FIND RESOURCES</NavLink>
              </NavButton>

          </NavItems>

        </NavFlexbox>
      </NavbarArea>

  );
};

export default Navbar;
