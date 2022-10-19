INSERT INTO public.wage_subsidy_applications (
	title, catchmentno, formtype, applicationid, applicationstatus, operatingname, businessnumber, businessaddress1, businesscity, businessprovince, businesspostal, businessphone, businessemail, otherworkaddress, sectortype, typeofindustry, organizationsize, cewsandorcrhp, employeedisplacement, labourdispute, unionconcurrence, liabilitycoverage, wagesubsidy, wsbccoverage, lawcomplianceconsent, orgeligibilityconsent, wsbcnumber, provincealt, participantemail0, positiontitle0, numberofpositions0, startdate0, hours0, wage0, duties0, skills0, workexperience0, numberofpositions1, signatorytitle, signatory1, organizationconsent, modified, created)
VALUES (
    'title', 
    1, 
    'claim', 
    '1a2b3c4d5e', /* Application ID */
    'In Progress', 
    'Operating Name', 
    'Business Number', 
    '1234 Address St.', 
    'Victoria', 
    'BC', 
    'A1B2C3', 
    '123-456-7890', 
    'business@email.com', 
    False, /* Other Business Address */
    'Sector Type', 
    'Type of Industry',
    '1-49',  /* Organization Size */
    True, /* CEWSAndOrCRHP */
    True, /* Employee Displacement */
    0, /* Labour Dispute */ 
    True, /* Union Concurrence */
    True, /* Liability Coverage */
    True, /* Wage Subsidy */
    True, /* WSBC Coverage */
    True, /* Law Compliance Consent */
    True, /* Org Eligibilty Consent */
    'BC123456', /* WSBC Number */
    'BC', 
    'participant@email.com', 
    'Position Title', 
    1, /* Number Of Positions */
    '01-01-2022', /* Start Date */
    35, /* Hours */
    12345, /* Wage */
    'Duties', 
    'Skills', 
    'Work Experience', 
    1, /* Number of Positions 1 */
    'Signatory Title', 
    'Signatory 1 Name', 
    True, /* Organization Consent*/
    '01-01-2022', /* Modified Date */
    '01-01-2022' /* Created Date */
);

INSERT INTO public.wage_subsidy_claim_form (
		title, catchmentno, formtype, applicationid, applicationstatus, periodstart1, periodstart2, isfinalclaim, operatingname, businessaddress1, businesscity, businesspostal, businessphone, employeefirstname, employeelastname, datefrom1, datefrom2, datefrom3, datefrom4, datefrom5, dateto1, dateto2, dateto3, dateto4, dateto5, hoursworked1, hoursworked2, hoursworked3, hoursworked4, hoursworked5, hourlywage1, hourlywage2, hourlywage3, hourlywage4, hourlywage5, workactivitiesandissues, totalwage1, totalwage2, totalwage3, totalwage4, totalwage5, eligiblewages, eligiblewages2, totalmercs1, totalmercs2, subsidyratepercent1, subsidyratepercent2, subsidyratedatefrom1, subsidyratedateto1, totalamountreimbursed1, claimapprovedby1, subsidyratedatefrom2, subsidyratedateto2, totalamountreimbursed2, claimapprovedby2, claimverifieddate, totalsubsidyclaimed, totalweeks1, totalweeks2, wagesreimbursed1, wagesreimbursed2, mercsreimbursed1, mercsreimbursed2, claimemployeeinfo, modified, created)
VALUES (
	'Title',
	1,
	'claim',
	'1a2b3c4d5e',
	'In Progress',
	'2022-01-01 07:00:00', /* Period 1 start */
	'02-02-2022 07:00:00', /* Period 2 start */
	False,
	'Operating Name',
	'1234 Business Address 1 St',
	'Victoria',
	'A1B2C3',
	'123-456-7890',
	'EmployeeFirstName',
	'EmployeeLastName',
	'01-01-2022', /* Date from 1*/
	'01-02-2022', /* Date from 2 */
	'01-03-2022', /* Date from 3 */
	'01-04-2022', /* Date from 4 */
	'01-05-2022', /* Date from 5 */ 
	'01-06-2022', /* Date to 1 */
	'01-07-2022', /* Date to 2 */
	'01-08-2022', /* Date to 3 */
	'01-09-2022', /* Date to 4 */
	'01-10-2022', /*Date to 5 */
	70, /* Hours Worked 1 */
	70, /* Hours Worked 2 */
	70, /* Hours Worked 3 */
	70, /* Hours Worked 4 */
	70, /* Hours Worked 5 */
	2340, /* Hourly Wage 1 */
	2340, /* Hourly Wage 2 */
	2340, /* Hourly Wage 3 */
	2340, /* Hourly Wage 4 */
	2340, /* Hourly Wage 5 */
	'Work Activities and Issues', 
	123456, /* Total Wage 1 */
	123456, /* Total Wage 2 */
	123456, /* Total Wage 3 */
	123456, /* Total Wage 4 */
	123456, /* Total Wage 5 */
	1234, /* Eligibile Wages */
	1234, /* Eligible Wages 2 */
	123, /* Total MERCs 1 */
	123, /* Total MERCs 2 */
	50, /* Subsidy Rate Percent 1 */
	25, /* Subsidy Rate Percent 2 */
	'01-01-2022', /* Subsidy Rate Date From 1 */
	'01-01-2022', /* Subsidy Rate Date to 1 */
	123456, /* Total Amount Reimbursed 1 */
	'Claim Approved By 1',
	'01-01-2022', /* Subsidy Rate Date From 2 */
	'01-01-2022', /* Subsidy Rate Date to 2 */
	123456, /* Total Amount Reimbursed 2 */
	'Claim approved by 2',
	'01-01-2022 12:34:56', /* Claim Verified Date */
	123456, /* Total Subsidy Claimed */
	1, /* Total Weeks 1 */
	2, /* Total Weeks 2 */
	12345, /* Wages Reimbursed 1 */
	12345, /* Wages Reimbursed 2 */
	1234, /* MERCs Reimbursed 1 */
	1234, /* MERCs Reimbursed 2 */
	'{"a": 2}'::jsonb, /* Claim Employee Info */
	'01-01-2022', /* Modified Date */
	'01-01-2022' /* Created Date */
);

INSERT INTO public.wage_subsidy_claim_form (title, catchmentno, formtype, applicationid, applicationstatus, periodstart1, periodstart2, isfinalclaim, operatingname, businessaddress1, businesscity, businesspostal, businessphone, employeefirstname, employeelastname, datefrom1, datefrom2, datefrom3, datefrom4, datefrom5, dateto1, dateto2, dateto3, dateto4, dateto5, hoursworked1, hoursworked2, hoursworked3, hoursworked4, hoursworked5, hourlywage1, hourlywage2, hourlywage3, hourlywage4, hourlywage5, workactivitiesandissues, totalwage1, totalwage2, totalwage3, totalwage4, totalwage5, eligiblewages, eligiblewages2, totalmercs1, totalmercs2, subsidyratepercent1, subsidyratepercent2, subsidyratedatefrom1, subsidyratedateto1, totalamountreimbursed1, claimapprovedby1, subsidyratedatefrom2, subsidyratedateto2, totalamountreimbursed2, claimapprovedby2, claimverifieddate, totalsubsidyclaimed, totalweeks1, totalweeks2, wagesreimbursed1, wagesreimbursed2, mercsreimbursed1, mercsreimbursed2, modified, created) VALUES (
	'Title',
	1,
	'claim',
	'1a2b3c4d5e',
	'In Progress',
	'2022-01-01 07:00:00', /* Period 1 start */
	NULL, /* Period 2 start */
	False,
	'Operating Name',
	'1234 Business Address 1 St',
	'Victoria',
	'A1B2C3',
	'123-456-7890',
	'EmployeeFirstName',
	'EmployeeLastName',
	'2021-01-01T00:00:00Z', /* Date from 1*/
	NULL, /* Date from 2 */
	NULL, /* Date from 3 */
	NULL, /* Date from 4 */
	NULL, /* Date from 5 */
	'2022-01-01T00:00:00Z', /* Date to 1 */
	NULL, /* Date to 2 */
	NULL, /* Date to 3 */
	NULL, /* Date to 4 */
	NULL, /* Date to 5 */
	40, /* Hours Worked 1 */
	NULL, /* Hours Worked 2 */
	NULL, /* Hours Worked 3 */
	NULL, /* Hours Worked 4 */
	NULL, /* Hours Worked 5 */
	18, /* Hourly Wage 1 */
	NULL, /* Hourly Wage 2 */
	NULL, /* Hourly Wage 3 */
	NULL, /* Hourly Wage 4 */
	NULL, /* Hourly Wage 5 */
	'abcde', /* Work activity and issues */
	123, /* Total Wage 1 */
	NULL, /* Total Wage 2 */
	NULL, /* Total Wage 3 */
	NULL, /* Total Wage 4 */
	NULL, /* Total Wage 5 */
	NULL, /* Eligibile Wages */
	NULL, /* Eligible Wages 2 */
	NULL, /* Total MERCs 1 */
	NULL, /* Total MERCs 2 */
	NULL, /* Subsidy Rate Percent 1 */
	NULL, /* Subsidy Rate Percent 2 */
	NULL, /* Subsidy Rate Date From 1 */
	NULL, /* Subsidy Rate Date to 1 */
	NULL, /* Total Amount Reimbursed 1 */
	'NULL',
	NULL, /* Subsidy Rate Date From 2 */
	NULL, /* Subsidy Rate Date to 2 */
	NULL, /* Total Amount Reimbursed 2 */
	'NULL',
	NULL, /* Claim Verified Date */
	NULL, /* Total Subsidy Claimed */
	NULL, /* Total Weeks 1 */
	NULL, /* Total Weeks 2 */
	NULL, /* Wages Reimbursed 1 */
	NULL, /* Wages Reimbursed 2 */
	NULL, /* MERCs Reimbursed 1 */
	NULL, /* MERCs Reimbursed 2 */
	'01-01-2022', /* Modified Date */
	'01-01-2022' /* Created Date */
            )  