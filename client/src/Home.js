import React from 'react'

function Home() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>WorkBC Wage Subsidy</h1>
                    <p>The WorkBC Wage Subsidy service provides funding to eligible employers to hire and provide work experience and on-the-job training to an individual who has been identified as needing work experience, to hire new employees or recall laid off employees. Eligible Employers who need an employee can either:</p>
                    <ol>
                        <li>Apply to be matched to a WorkBC Client; or</li>
                        <li>Apply with their identified employee.</li>
                    </ol>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>I have an employee</h2>
                    <p><a href="/haveEmployee" className="btn btn-lg btn-primary">Start</a><br/></p>
                </div>
                <div className="col-md-6">
                    <h2>I need an employee</h2>
                    <p><a href="/needEmployee" className="btn btn-lg btn-primary">Start</a><br/></p>
                </div>
            </div>
        </div>
    )
}

export default Home;