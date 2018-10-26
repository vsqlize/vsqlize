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
      }],
      loggedIn : false,
    }

    this.getTables = this.getTables.bind(this);
    this.getTableData = this.getTableData.bind(this);
    this.toggleContentLogInDisplay = this.toggleContentLogInDisplay.bind(this);
  }

  getTableData(tableName) {
    fetch(`/api/table?table=${tableName}`)
      .then(res => res.json())
      .then(data => this.setState({ headers: data.headers, data: data.data }))
  }

  toggleContentLogInDisplay() {
    this.setState({loggedIn : !this.state.loggedIn});
  }

  getTables(res) {
    this.setState({
      tables: res
    });
  }

<<<<<<< HEAD
  handleLogInLogOut() {
    
  }

=======
>>>>>>> 4174cf424a131b47cfb3d5a70a9e4c9d31117b63
  render() {
    const { data, headers } = this.state;
    const colNames = [];
    headers.forEach(head => {
      colNames.push({
        Header: head,
        accessor: head
      })

    })

    let isDisplayedLogInWindow = this.state.loggedIn ? 'none' : 'block';
    let isDisplayedLoggedInContent = this.state.loggedIn ? 'block' : 'none';

    return(
      <div>
        
        <div style={{marginTop:'50px'}}>
          <div id='logInWindow' style={{display : isDisplayedLogInWindow}}>
            <ConnectionBox cb={this.getTables} toggleContentLogInDisplay={this.toggleContentLogInDisplay}/>
          </div>
          
          <div id="loggedInContent" style={{display : isDisplayedLoggedInContent}}>
            <NavBar />
            <div className="sideBar">
              <SideBar tables={ this.state.tables } getTableData={ this.getTableData }/>
            </div>
            <div className="viewTable">
              <ReactTable data = { data } columns = { colNames }/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
