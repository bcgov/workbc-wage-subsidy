import React from 'react'
import logo from './bcid-logo-rev-en.svg'
import logoSmall from './bcid-symbol-rev.svg'

function Header () {
    return (
        <header>
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container">
            <a className="navbar-brand" href="https://www2.gov.bc.ca">
              <img 
                className="img-fluid d-none d-md-block"
                src={logo} 
                width="177"
                height="44"
                alt="B.C. Government Logo" />
              <img 
                className="img-fluid d-md-none" 
                src={logoSmall} 
                width="63" 
                height="44" 
                alt="B.C. Government Logo" />
            </a>
            <div className="navbar-brand">
              WorkBC Wage Subsidy
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <a className="nav-item nav-link" href="/">Home</a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    )
}

export default Header