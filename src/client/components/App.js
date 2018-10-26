import React, { Component } from 'react';
import '../app.css';
import SideBar from './Sidebar';
import ConnectionBox from './ConnectionBox.jsx';
import NavBar from './NavBar.jsx';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTable: null,
      tables: [],
      headers: [],
      data: [{
        id: '01',
        name: 'Kyle Combs',
        age: '40',
        address: '53 2nd Avenue #5B',
        salary: 120000 
      }]
    }

    this.getTables = this.getTables.bind(this);
    // this.setCurrentTable = this.setCurrentTable.bind(this);
    this.getTableData = this.getTableData.bind(this);

  }

  // setCurrentTable(tableName) {
  //   this.setState({ currentTable: tableName });
  // }

  getTableData(tableName) {
    console.log('i ran');
    fetch(`/api/table?table=${tableName}`)
      .then(res => res.json())
      .then(data => this.setState({ headers: data.headers, data: data.data }))
  }

  getTables(res) {
    this.setState({
      tables: res
    });
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
        <NavBar />
        <div style={{marginTop:'50px'}}>
          <ConnectionBox cb={this.getTables}/>
          <div className="sideBar"><SideBar tables={ this.state.tables } getTableData={ this.getTableData }/></div>
          <div className="viewTable">
          <ReactTable
            data = { data }
            columns = { colNames }
          />
          </div>
        </div>
      </div>
    )
  }
}
