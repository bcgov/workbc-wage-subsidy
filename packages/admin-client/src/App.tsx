import React from 'react'
import './App.css'
import { Admin, Resource } from 'react-admin'
import { ClaimsList } from './Claims/ClaimsList'
import Footer from './admin/footer'
import Layout from './admin/Layout'
import { dataProvider } from './DataProvider/DataProvider'

export const lightTheme = {
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          color: '#fff',
          backgroundColor: '#003366',
          borderBottom: '3px solid #FCBA19'
        }
      }
    }
  }
}

function App() {
  return (
    <div className="App">
      <Admin dataProvider={dataProvider} layout={Layout} theme={lightTheme}>
        <Resource name="claims" list={ClaimsList} />
      </Admin>
      <Footer />
    </div>
  )
}

export default App
