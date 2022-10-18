import React from 'react';
import './App.css';
import { ApplicationList } from './admin/ApplicationList';
import Footer from './admin/footer';
import jsonServerProvider from 'ra-data-json-server';
import { Admin, Resource } from 'react-admin';
import Layout from './admin/Layout';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

export const lightTheme = {
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          color: '#fff',
          backgroundColor: '#003366',
          borderBottom: '3px solid #FCBA19'
        },
      },
    },
  },
}

function App() {
  return (
    <div className="App">
      <Admin dataProvider={dataProvider} layout={Layout} theme={lightTheme}>
        <Resource name="todos" list={ApplicationList} />
      </Admin>
      <Footer/>
    </div>
  );
}

export default App;
