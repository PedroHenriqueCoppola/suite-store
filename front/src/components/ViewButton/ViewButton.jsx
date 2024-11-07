import React from 'react';
import '../../App.css'
import './ViewButton.css'
import eye from '../../assets/eye.png'

const ViewButton = (props) => {
  return (
    <button className="viewButton" onClick={props.onClick}>
      <div className="sign"><img src={eye} alt="" /></div>
      <div className="text">View</div>
    </button>
  );
}

export default ViewButton;
