import React, { Component } from 'react';
import '../ConnectionBox.css';

class ConnectionBox extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    console.log(this.state)
    fetch('/api/connect', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({
        'host': this.state.host,
        'port': this.state.port,
        'user': this.state.user,
        'password': this.state.password,
        'database': this.state.database
      })
    })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      this.props.cb(res)
    });

    event.preventDefault();
    this.setState({ value: '' });
  }

  render(){
    return (      
      <div className='wrapper'>
        <div className='connectionBox'>
          <form onSubmit={this.handleSubmit}>
            <div>Server/Host: 
                <input type='text' name='host' value={this.state.host} onChange={this.handleChange} />
            </div>
            <div>Port:
                <input type='text' name='port' value={this.state.port} onChange={this.handleChange} />
            </div>  
            <div>User:
                <input type='text' name='user' value={this.state.user} onChange={this.handleChange} />
            </div>
            <div>Password:
                <input type='text' name='password' value={this.state.password} onChange={this.handleChange} />
            </div>
            <div>Database:
                <input type='text' name='database' value={this.state.database} onChange={this.handleChange} />
            </div>

            <button id='submit-button' value="Submit">submit</button>
          </form>
        </div>
      </div>
    )
  }

} export default ConnectionBox;