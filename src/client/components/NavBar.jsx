import React, { Component } from 'react';
import '../ConnectionBox.css';
import dataIcon from '../assets/data-icon.svg';
import queryIcon from '../assets/query-icon.svg';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

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
          <li><a className="active" href="#data" name='data' onClick={this.props.handleClick}>Log Out</a></li>
        </ul>
        </div>
      </div>
    )
  }

} export default NavBar;