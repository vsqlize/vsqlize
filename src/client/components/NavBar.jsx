import React, { Component } from 'react';
import '../ConnectionBox.css';
import userIcon from '../assets/user-icon.svg';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (      
      <div className='wrapper'>
        <div className='navBar'>
        <ul>
          <li><a className="active" href="#data" name='data' onClick={this.props.logout}><img src={userIcon} className='svgicons'/>Log Out</a></li>
        </ul>
        </div>
      </div>
    )
  }

} export default NavBar;