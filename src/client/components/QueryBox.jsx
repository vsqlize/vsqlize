import React, { Component } from 'react';
import '../ConnectionBox.css';

class QueryBox extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      queryText: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ queryText: event.target.value});
  }

  handleSubmit(event) {
    fetch('/api/table', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({
        'sqlQuery': this.state.queryText
      })
    })
    .then((res) => res.json())
    .then((res) => {
      this.props.cb(res)
    });

    event.preventDefault();
    this.setState({ value: '' });
  }

  render(){
    return (      
      <div>
        <div className='queryBox' style={{marginLeft:'200px'}}>
          <form onSubmit={this.handleSubmit}>
            <textarea value={this.state.queryText} onChange={this.handleChange} />
            <button id='submit-button' value="Submit">Query</button>
          </form>  
        </div>
      </div>
    )
  }

} export default QueryBox;