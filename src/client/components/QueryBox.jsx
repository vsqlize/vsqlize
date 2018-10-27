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
        <div className='queryBox' style={{marginLeft:'200px'}}>
          <form onSubmit={this.props.handleQuerySubmit}>
            <textarea value={this.props.queryString} onChange={this.props.handleQueryChange} />
            <button id='submit-button' value="Submit">Query</button>
          </form>  
        </div>
      </div>
    )
  }

} export default QueryBox;