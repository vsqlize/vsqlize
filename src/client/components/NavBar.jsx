import React, { Component } from 'react';
import '../ConnectionBox.css';
import userIcon from '../assets/user-icon.svg';

class NavBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      //loggedin:
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    console.log('i was clicked')

    event.preventDefault();
  }

  render(){
    return (      
      <div className='wrapper'>
        <div className='navBar'>
        <ul>
          <li><a className="active" href="#data" name='data' onClick={this.handleClick}><img src={userIcon} className='svgicons'/>Log Out</a></li>
        </ul>
        </div>
      </div>
    )
  }

} export default NavBar;