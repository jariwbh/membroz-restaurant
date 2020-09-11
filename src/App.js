import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Assets/css/custom.css'
import Default from './Pages/Default'
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Default />
      </React.Fragment>
    );
  }
}

export default App;
