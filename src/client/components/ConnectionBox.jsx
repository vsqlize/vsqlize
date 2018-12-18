import React, { Component } from 'react';
import '../ConnectionBox.css';
import logo from '../assets/logo.png';

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
      this.props.cb(res);
      this.props.toggleContentLogInDisplay()
      this.setState({
        host: '',
        port: '',
        user: '',
        password: '',
        database: ''
      });
    });

    event.preventDefault();
  }

  render(){
    return (      
      <div className='connectionBoxwrapper'>
        <div className='logoAndConnectionBox'>
          <div className='logo'><img src={logo}/></div>
            <p>Provide your SQL database connection details to utilize vSQLize</p>
          <form onSubmit={this.handleSubmit}>
            <div className='connectionBox'>
              <div className='connectionBoxTop'>
                <div className='connectionBoxLeft'>
                  <div>Server/Host:</div>
                  <div>Port:</div>
                  <div>User:</div>
                  <div>Password:</div>
                  <div>Database:</div>
                </div>
                <div className='connectionBoxRight'>
                  <input type='text' name='host' value={this.state.host} onChange={this.handleChange} />
                  <input type='text' name='port' value={this.state.port} onChange={this.handleChange} />
                  <input type='text' name='user' value={this.state.user} onChange={this.handleChange} />
                  <input type='text' name='password' value={this.state.password} onChange={this.handleChange} />
                  <input type='text' name='database' value={this.state.database} onChange={this.handleChange} />
                </div>
              </div>  
              <div className='connectionBoxBottom'>
                <button id='submit-button' value="Submit">submit</button>
              </div>
            </div>
          </form>
        </div>  
      </div>
    )
  }

} export default ConnectionBox;