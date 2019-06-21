import React from 'react'
import Popup from 'react-popup';
const popup = ()=>{
  return(
    <Popup trigger={<button> Trigger</button>} position="right center">
      <div>Popup content here !!</div>
    </Popup>
  );
}

export default popup;
