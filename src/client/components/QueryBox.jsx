import React, { Component } from 'react';
import '../ConnectionBox.css';

class QueryBox extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

  }

  render(){
    return (      
      <div>
        <div className='queryBox'>
          <form onSubmit={this.props.handleQuerySubmit}>
            <div className='test'></div>
            <textarea value={this.props.queryString} onChange={this.props.handleQueryChange} />
            <div className='queryButton'><button id='submit-button' value="Submit">Query</button></div>
          </form>  
        </div>
      </div>
    )
  }

} export default QueryBox;