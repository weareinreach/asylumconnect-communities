import React from 'react';
import styled from 'styled-components'

const Text = styled.text`
background: transparent;
border-radius: 10px; 

`

const TextBox = props => {
  const {text} = props;
  return (
      <Text>
        {text}
      </Text>
  );
};
export default TextBox;