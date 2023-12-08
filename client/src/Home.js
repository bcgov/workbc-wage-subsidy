import React from "react";

function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1>WorkBC Wage Subsidy</h1>
          <div className="p-2" style={{ border: "2px solid black" }}>
            <h2 className="text-danger">
              New Requirement for Access: Business or Basic BCeID
            </h2>
            <p>
              A <strong>new Wage Subsidy platform</strong> will launch on{" "}
              <strong>January 17th</strong>. It requires a{" "}

              <strong>Business</strong> or <strong>Basic BCeID</strong> to sign
              in. Your new Wage Subsidy account will give you access to the
              following:
            </p>
            <ul>
              <li>
                A record of current and past applications and claim forms
                submitted on the platform (applications and claim forms
                submitted using the old platform will not be accessible on the
                new one)
              </li>
              <li>Real-time status updates for applications and claim forms</li>
              <li>Simplified form completion</li>
              <li>
                Ability to share applications and claim forms amongst others in
                your organization (Business BCeID only)
              </li>
            </ul>
            <p
              style={{ cursor: "pointer", width: "fit-content" }}
              className="text-primary"
              data-toggle="modal"
              data-target="#exampleModalCenter"
            >
              <u>Learn more about Business BCeID and Basic BCeID</u>
            </p>
          </div>
          <p>
            The WorkBC Wage Subsidy program provides funding to eligible
            employers to hire, provide work experience and on-the-job training
            to unemployed British Columbians.
          </p>
          <p>Wage subsidy offers employers:</p>
          <ul>
            <li>A portion of employee wages</li>
            <li>Support for ongoing operations and expansion</li>
            <li>
              Disability supports to reduce work-related barriers for an
              employee
            </li>
            <li>An opportunity to:</li>
            <ul>
              <li>Re-hire laid off employees</li>
              <li>Hire new employees</li>
              <li>
                Better connect job seekers and employers to meet hiring needs
              </li>
            </ul>
            <li>
              Job Seeker Eligibility: All residents of B.C. who are not employed
              at all
            </li>
          </ul>
          <p>
            In order to submit your application for Wage Subsidy, you will need
            the following information:
          </p>
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
          <p>
            <a href="/haveEmployee" className="btn btn-lg btn-primary">
              Start
            </a>
            <br />
          </p>
        </div>
        <div className="col-md-6">
          <h3>Apply to be matched to a WorkBC Client</h3>
          <p>
            <a href="/needEmployee" className="btn btn-lg btn-primary">
              Start
            </a>
            <br />
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <hr></hr>
          <h3>Claim Form</h3>
          <p>
            <a href="/claimForm" className="btn btn-lg btn-primary">
              Submit a claim
            </a>
            <br />
          </p>
        </div>
      </div>
      {/* <!-- Modal --> */}
      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          class="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
            <h2>
                  Business BCeID
                </h2>
              <p>
                Use a{" "}
                <a
                  href="https://www.bceid.ca/register/business/getting_started/getting_started.aspx"
                  title="https://www.bceid.ca/register/business/getting_started/getting_started.aspx"
                >
                  Business BCeID
                </a>{" "}
                if you would like to view and{" "}
                <strong>share applications</strong> and{" "}
                <strong>claim forms</strong>{" "}
                <strong>within your organization</strong>.&nbsp;
                <br />
                &nbsp;
                <br />
                &nbsp;Important notes: &nbsp;
              </p>
              <ul>
                <li>
                  If you are starting a new Business BCeID registration, it can
                  take some time to verify your business if it is not already
                  registered with{" "}
                  <a
                    href="https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/citizens-services/bc-registries-online-services"
                    title="https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/citizens-services/bc-registries-online-services"
                  >
                    BC Registries and Online Services
                  </a>
                  .
                </li>
                <li>
                  You can <strong>convert</strong> a{" "}
                  <strong>Basic BCeID</strong> to a{" "}
                  <strong>Business BCeID</strong>. If time is an issue and you
                  don&rsquo;t already have a Business BCeID, set up a Basic
                  BCeID now and convert it later.
                </li>
              </ul>
              <p>
                If your organization already has a Business BCeID account, talk
                to your account administrator to ensure you have a user account
                under the organization&rsquo;s overall account. Once you have
                this user account set up, use this to log in to Wage Subsidy.
              </p>
              <p>
                <h2>
                  Basic BCeID
                </h2>
                With a&nbsp;
                <a
                  href="https://www.bceid.ca/register/basic/account_details.aspx?type=regular&eServiceType=basic"
                  title="https://www.bceid.ca/register/basic/account_details.aspx?type=regular&eServiceType=basic"
                >
                  Basic BCeID
                </a>
                , you will be able to log in to Wage Subsidy to submit and view
                your own applications and claim forms.&nbsp;
                <br />
                &nbsp;
                <br />
                Note that you will <strong>not</strong> be able to share
                applications and claim forms with others if you are using a
                Basic BCeID; only Business BCeID users will be able to share
                these forms with those within their own organization.
              </p>
              <p
                style={{
                  margin: "0cm",
                  fontSize: "15px",
                  fontFamily: "Calibri, sans-serif",
                }}
              >
                &nbsp;
              </p>
              <p>
                For{" "}
                <a href="https://www.bceid.ca/" title="https://www.bceid.ca/">
                  more information
                </a>{" "}
                and{" "}
                <a
                  href="https://www.bceid.ca/aboutbceid/faqs.aspx"
                  title="https://www.bceid.ca/aboutbceid/faqs.aspx"
                >
                  Frequently Asked Questions
                </a>
                , visit{" "}
                <a href="https://www.bceid.ca/" title="https://www.bceid.ca/">
                  www.bceid.ca
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
