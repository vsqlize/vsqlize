import React, { Component } from 'react';
import '../app.css';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: ['Users', 'Dogs', 'Cats', 'Hampsters']
    }
  }

  componentDidMount() {

  }

  render() {
    const { tables } = this.state;
    const tableNames = [];
    tables.forEach(table => {
      tableNames.push({tableName: table});
    })

    console.log(tableNames);

    return(
      <ReactTable
        data = { tableNames }
        columns = {[
          {
            Header: "Tables",
            accessor: "tableName"
          }
        ]} 
      
      />
    )
  }
}