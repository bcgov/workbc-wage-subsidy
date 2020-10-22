import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from './Home'
import HaveEmployeeForm from './components/Forms/HaveEmployeeForm/HaveEmployeeForm'
import NeedEmployeeForm from './components/Forms/NeedEmployeeForm/NeedEmployeeForm'
import Thankyou from './Thankyou'
import ClaimForm from './components/Forms/ClaimForm/ClaimForm'
import ParticipantForm from './components/Forms/ParticipantForm/ParticipantForm'
import ThankyouClaimForm from './components/Forms/ClaimForm/ThankyouClaimForm'


function Main() {
    return (
        <main role="main">
            <Router>
                <Switch>
                    <Route path="/haveEmployee">
                        <HaveEmployeeForm />
                    </Route>
                    <Route path="/needEmployee">
                        <NeedEmployeeForm />
                    </Route>
                    <Route path="/thankyou">
                        <Thankyou />
                    </Route>
                    <Route path="/claimForm" component={ClaimForm}/>
                    <Route path="/thankyouClaimForm" component={ThankyouClaimForm} />
                    <Route path="/participantForm" component={ParticipantForm}/>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </main>
    )
    
}

export default Main