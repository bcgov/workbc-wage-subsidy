import React from 'react'

function Home() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>WorkBC Wage Subsidy</h1>
                    <p>The WorkBC Wage Subsidy program provides funding to eligible employers to hire, provide work experience and on-the-job training.</p>
                    <p>Wage subsidy offers employers:</p>
                    <ul>
                        <li>A portion of employee wages</li>
                        <li>Support for ongoing operations and expansion</li>
                        <li>Disability supports to reduce work-related barriers for an employee</li>
                        <li>An opportunity to:</li>
                        <ul>
                            <li>Re-hire laid off employees</li>
                            <li>Hire new employees</li>
                            <li>Better connect job seekers and employers to meet hiring needs</li>
                        </ul>
                    </ul>
                    <p>In order to submit your application for Wage Subsidy, you will need the following information:</p>
                    <ul>
                        <li>Your CRA Business Number</li>
                        <li>Your employee’s e-mail address (if you have an employee)</li>
                    </ul>
                    <p>Employers who need an employee can either:</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h3>Apply with their identified employee</h3>
                    <p><a href="/haveEmployee" className="btn btn-lg btn-primary">Start</a><br/></p>
                </div>
                <div className="col-md-6">
                    <h3>Apply to be matched to a WorkBC Client</h3>
                    <p><a href="/needEmployee" className="btn btn-lg btn-primary">Start</a><br/></p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <hr></hr>
                    <h3>Claim Form</h3>
                    <p><a href="/claimForm" className="btn btn-lg btn-primary">Submit a claim</a><br/></p>
                </div>
            </div>
        </div>
    )
}

export default Home;