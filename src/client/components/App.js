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
      tables: [],
      headers: ['id', 'name', 'age', 'address', 'salary'],
      data: [{
        id: '01',
        name: 'Kyle Combs',
        age: '40',
        address: '53 2nd Avenue #5B',
        salary: 120000 
      }]
    }

    this.getTables = this.getTables.bind(this);

  }

  getTables(res) {
    this.setState({
      tables: res
    });
    console.log(this.state)
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
          <div className="sideBar"><SideBar tables={ this.state.tables }/></div>
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
