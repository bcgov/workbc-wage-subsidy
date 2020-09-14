import React from 'react'

function Home() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>WorkBC Wage Subsidy</h1>
                    <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
                    <ul>
                        <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
                        <li>Aliquam tincidunt mauris eu risus.</li>
                        <li>Vestibulum auctor dapibus neque.</li>
                    </ul>

         
                    
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