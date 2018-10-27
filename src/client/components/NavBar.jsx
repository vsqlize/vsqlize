import React, { Component } from 'react';
import '../ConnectionBox.css';
import userIcon from '../assets/user-icon.svg';
import logo from '../assets/logo.png';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (      
      <div className='wrapper'>
        <div className='navBar'>
        <img src={logo} style={{height: '40px', float: 'left', margin: '5px 30px'}}/>
        <ul>
          <li>
            <a className="active" href="#data" name='data' onClick={this.props.logout}>
              <img src={userIcon} style={{marginRight: '80px'}} className='svgicons'/>
              <div style={{marginTop: '-20px'}}>Log Out</div>
            </a>
          </li>
        </ul>
        </div>
      </div>
    )
  }

} export default NavBar;