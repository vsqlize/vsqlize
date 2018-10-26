import React, { Component } from 'react';
import ConnectionBox from './ConnectionBox.jsx';

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tables: []
    }
    this.getTables = this.getTables.bind(this);
  }

  getTables(res) {
    this.setState({
      tables: res
    });
    console.log(this.state)
  }

  render() {
    
    return (
      <ConnectionBox 
        cb={this.getTables}/>
    );
  }
}
