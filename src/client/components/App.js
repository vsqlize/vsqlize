import React, { Component } from 'react';
import '../app.css';
import SideBar from './Sidebar';
import ConnectionBox from './ConnectionBox.jsx';
import NavBar from './NavBar.jsx';
import QueryBox from './QueryBox.jsx';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTable: '',
      queryString: '',
      tables: [],
      headers: [],
      data: [],
      primaryKey : '',
      loggedIn : false,
    }

    this.getTables = this.getTables.bind(this);
    this.getTableData = this.getTableData.bind(this);
    this.toggleContentLogInDisplay = this.toggleContentLogInDisplay.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleQuerySubmit = this.handleQuerySubmit.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
  }

  getTableData(tableName) {
    fetch(`/api/table?table=${tableName}`)
      .then(res => res.json())
      .then(data => {
        if(data.AuthError) {
          this.toggleContentLogInDisplay();
        } else {
          this.setState({ currentTable: tableName, queryString: data.queryString, headers: data.headers, data: data.data, primaryKey: data.primaryKey});
        }
      })
  }

  toggleContentLogInDisplay() {
    this.setState({loggedIn : !this.state.loggedIn});
  }

  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;

          const obj = {
            table: this.state.currentTable,
            primaryKey: this.state.primaryKey,
            primaryKeyValue: data[cellInfo.index][this.state.primaryKey],
            updateField: cellInfo.column.id,
            updateFieldValue: data[cellInfo.index][cellInfo.column.id]
          }

          fetch('/api/table', {
            method: 'PATCH', 
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(obj)           
          })
          .then((res) => res.json())
          .then((res) => {
            if(res.AuthError) {
              this.toggleContentLogInDisplay();
            } else {
              const obj = {
                queryString : res.queryString,
                headers: res.headers,
                data: res.data,
              }
              this.setState(obj);
            }
          });


          // this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  getTables(res) {
    this.setState({
      tables: res
    });
  }

  handleQueryChange(event) {
    this.setState({ queryString: event.target.value});
  }

  handleQuerySubmit(event) {
    fetch('/api/table', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({
        'sqlQuery': this.state.queryString
      })
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.AuthError) {
        this.toggleContentLogInDisplay();
      } else if (res.DatabaseError) {
        alert('INVALID QUERY');
      }
      else {
        const obj = {
          queryString : res.queryString,
          headers: res.headers,
          data: res.data,
        }
        this.setState(obj);
      }
    });

    event.preventDefault();
    this.setState({ value: '' });
  }

  render() {
    const { data, headers } = this.state;
    const colNames = [];
    headers.forEach(head => {
      colNames.push({
        Header: head,
        accessor: head,
        Cell: this.renderEditable
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
            <NavBar logout={ this.toggleContentLogInDisplay }/>
            <div className="sideBar">
              <SideBar tables={ this.state.tables } getTableData={ this.getTableData }/>
            </div>
            <QueryBox handleQueryChange={this.handleQueryChange} queryString={this.state.queryString} handleQuerySubmit={this.handleQuerySubmit} />
            <div className="viewTable">
              <ReactTable 
                getTdProps={this.getTdProps}
                data = { data } columns = { colNames }
                defaultSorted={[
                  {
                    id: this.state.primaryKey,
                    // desc: false
                  }
                ]}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
