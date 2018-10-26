import React, { Component } from 'react';
import '../app.css';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTable: null
    }

  }

  setCurrentTable(tableName) {
    this.setState({ currentTable: tableName })
  }

  render() {
    const { tables } = this.props;
    const tableNames = [];
    tables.forEach(table => {
      tableNames.push({tableName: table});
    })

    return(
      <ReactTable
      getTdProps={(state, rowInfo, column, instance) => {
        return {
            onClick: () => {
              this.props.getTableData(rowInfo.original.tableName);
            }
          };
        }}
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