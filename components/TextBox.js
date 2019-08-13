import React from 'react'
import styled from 'styled-components'

const Text = styled.text`
  background: transparent;
  border-radius: 10px;
`

export default ({ text }) => <Text>{text}</Text>
