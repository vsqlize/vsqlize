import React, { Component } from 'react';
import '../ConnectionBox.css';

class QueryBox extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

  }

  formatQueryString(string) {
    string = string.replace(/select/gi, 'SELECT');
    string = string.replace(/from/gi, 'FROM');
    string = string.replace(/where/gi, 'WHERE');
    string = string.replace(/on/gi, 'ON');
    return string;
  }

  render(){
    return (      
      <div>
        <div className='queryBox'>
          <form onSubmit={this.props.handleQuerySubmit}>
            <div className='test'></div>
            <textarea value={this.formatQueryString(this.props.queryString)} onChange={this.props.handleQueryChange} />
            <div className='queryButton'><button id='submit-button' value="Submit">Query</button></div>
          </form>  
        </div>
      </div>
    )
  }

} export default QueryBox;