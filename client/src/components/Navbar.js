import React from 'react'
//import Avatar from'@material-ui/core/Avatar'
import styled from 'styled-components'
import {NavLink}  from 'react-router-dom'

const NavbarArea  = styled.div`
  width:858.5px;
  height: 100px;

`;
const NavFlexbox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 4%;
`;
const NavItems = styled.div`
  width: 73.6px;
  height: 16px;
  font-family: Roboto;
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

const Navbar = () =>{

  return(
      <NavbarArea>
        <NavFlexbox>

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
            <NavLink to="/"> FIND RESOURCES</NavLink>
          </NavItems>

        </NavFlexbox>
      </NavbarArea>

  );
};

export default Navbar;
