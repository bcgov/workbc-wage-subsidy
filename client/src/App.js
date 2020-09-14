import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import './App.scss';
import Header from './Header'
import Main from './Main'
import Footer from './Footer'


function App() {
  return (
    <Router>
        <Header />
        <Main />
        <Footer />
    </Router>
  );
}

export default App;
