INSERT INTO public.wage_subsidy_applications VALUES (
    2, 
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

INSERT INTO public.wage_subsidy_claim_form VALUES (
	2,
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