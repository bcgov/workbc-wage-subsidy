import React from 'react'

function ParticipantHome() {
    return (
        <div className="row" style={{ marginTop: '2em' }}>
            <div className="col-md-12">
                <h4>Collection Notice</h4>
                <p className="small">
                    Personal information collected on this form is collected under the authority of sections 26 (c) and (e) of the Freedom of Information and Protection of Privacy Act (FOIPPA) and is subject to all of the provisions of that Act. The personal information collected may be used by the Ministry of Social Development and Poverty Reduction, its service providers and associates of those service providers to administer and evaluate the effectiveness of Wage Subsidy. Under the authority of section 33.1 (d) of FOIPPA, the personal information collected may also be disclosed to Employment and Social Development Canada or the Canada Employment Insurance Commission, either of which may use your personal information to monitor, assess or evaluate the effectiveness of Wage Subsidy. If you have any questions about the collection, use or disclosure of your personal information, please contact the Records clerk of the Employment and Labour Market Services Division, Ministry of Social Development and Poverty Reduction at <a href="mailto:WorkBCOESprivacy@gov.bc.ca">WorkBCOESprivacy@gov.bc.ca</a>.
            </p>
                <h4>Consent for Collection, Use and Disclosure</h4>
                <p className="small">
                    I consent to the Ministry of Social Development and Poverty Reduction, its service providers and associates of those service providers:
            </p>
                <ul>
                    <li className="small">Disclosing my personal information to any employer that may have a suitable job opportunity for me;</li>
                    <li className="small">Collecting my personal information from any employer to which I have been referred, or to which my  personal information has been provided, for the purposes of administering or evaluating Wage Subsidy; and</li>
                    <li className="small">Using my personal information to contact me to discuss other services for which I may be eligible.</li>
                </ul>
                <p className="small">
                    <b>I acknowledge and understand that by clicking the "submit" icon, I am attaching my electronic signature to this form, and that by doing so, I am providing the same consent as I would by manually signing a physical copy of this form.</b>
                </p>
            </div>
        </div>
    )
}