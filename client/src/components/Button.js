import React from 'react';
import Button from 'react-bootstrap/Button'

let disabledButton = props => {
  const { title, disabled } = props;

  return (
    <Button
      disabled={disabled}
      variant="outline-success"
      size="lg"
      active>
      <text>{title}</text>
    </Button>
  );
};

let clickableButton = props => {
  const { onPress, title, onClick} = props;

  return (
    <Button onPress={onPress}
    onClick={onClick}
       variant="primary"

    size="sm">
      <text>{title}</text>
    </Button>
  );
};

const Buttons = props =>{
  const { disabled } = props;

  return disabled ? disabledButton(props) : clickableButton(props);
}

export default Buttons;
