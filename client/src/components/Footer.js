import React from 'react'
import styled from 'styled-components'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Facebook from '../assets/facebook.png'
import Twitter from '../assets/twitter.png'
import LinkedIn from '../assets/linkedin.png'
import Instagram from '../assets/instagram.png'
import Email from '../assets/email.png'
import YouTube from '../assets/youtube.png'

const FooterArea  = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  bottom: 0;
  width: 100%;
  height: 132px;
  background-color: #5073b3;
`;

const ConnectWithAsylumColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const SocialMediaRow = styled.div`
  display: flex;
  flex-direction: row;
  filter: invert(1);
`;

const SocialMediaIcon = styled.img`
  margin: 12px;
`;

const SectionHeader = styled.div`
  color: white;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  margin: 16px auto;
`;

const NewsletterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NewsletterButton = withStyles({
  root: {
    background: '#cc4747',
    borderRadius: 15,
    border: 0,
    color: 'white',
    height: 32,
    padding: '0 30px',
    fontSize: '16px',
    width: 'fit-content',
    '&:hover': {
      backgroundColor: "#8D2A25",
    },
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

const Footer = () =>{

  return(
      <FooterArea>
        <ConnectWithAsylumColumn>
          <SectionHeader>Connect with AsylumConnect</SectionHeader>
          <SocialMediaRow>
            <a href="https://www.facebook.com/asylumconnect"><SocialMediaIcon src={Facebook} /></a>
            <a href="https://twitter.com/AsylumConnect"><SocialMediaIcon src={Twitter} /></a>
            <a href="https://www.linkedin.com/company/6454603/"><SocialMediaIcon src={LinkedIn} /></a>
            <a href="https://www.instagram.com/asylumconnect/"><SocialMediaIcon src={Instagram} /></a>
            <a href="mailto:catalog@asylumconnect.org"><SocialMediaIcon src={Email} /></a>
            <a href="https://www.youtube.com/channel/UCJsVS5-0ymo40mRjCe4BIHA"><SocialMediaIcon src={YouTube} /></a>
          </SocialMediaRow>
        </ConnectWithAsylumColumn>
        <NewsletterColumn>
          <SectionHeader>Stay Updated on AsylumConnect's Lifesaving Initiatives</SectionHeader>
          <NewsletterButton onClick={() => { window.location.href = "https://www.asylumconnect.org/follow-us-subscribe"; }}>Subscribe to Our Newsletter</NewsletterButton>
        </NewsletterColumn>
      </FooterArea>

  );
};

export default Footer;
