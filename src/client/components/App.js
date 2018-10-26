import React, { Component } from 'react';
import '../app.css';
import SideBar from './Sidebar';


import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: ['id', 'name', 'age', 'address', 'salary'],
      data: [{
        id: '01',
        name: 'Kyle Combs',
        age: '40',
        address: '53 2nd Avenue #5B',
        salary: 120000 
      }]
    }
  }

  componentDidMount() {

  }

  render() {
    const { data, headers } = this.state;
    const colNames = [];
    headers.forEach(head => {
      colNames.push({
        Header: head,
        accessor: head
      })

    })

    return(
      <div>

        <div className="sideBar"><SideBar /></div>
        <div className="viewTable">
        <ReactTable
          data = { data }
          columns = { colNames }
        />
        </div>
        
      </div>
    )
  }
}