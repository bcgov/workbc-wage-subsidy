import * as yup from 'yup'
import "yup-phone"
import 'core-js/stable';


export const HaveEmployeeValidationSchema = yup.object().shape({
    //step 1
    _ca: yup.string()
        .required("Please verify your workplace or organization address."),
    operatingName: yup.string()
        .required('Please enter the Organization name'),
    businessNumber: yup.string()
        .matches(/^[0-9]{9}[A-Z]{2}[0-9]{4}$/gi,"Number is Incorrect should be in the form: 123456789 BC0001 ")
        .max(15, "Business number must be exactly 15 characters")
        .min(15, "Business number must be exactly 15 characters.")
        .required('Please enter your business number.'),
    businessAddress: yup.string()
        .max(255,"Address too long")
        .required("please enter your organizations address"),
    businessCity:yup.string()
        .max(100,"City name too long")
        .required("please enter your organizations city"),
    businessProvince:yup.string()
        .required("Please enter a valid province"),
    businessPostal:yup.string()
        .matches(/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/,"Please enter a valid Postal Code")
        .required("Please enter a valid Postal Code"),
    businessPhone:yup.string()
        .phone("CA", false, "Please enter a valid number.")
        .required("Please enter phone."),
    businessFax:yup.string().test('Is-valid-fax','Invalid fax',
        value => (value +"").match(/^\d{1}-\d{3}-\d{3}-\d{4}$/gi) || value === undefined,
        ),
    businessEmail:yup.string().email("Please enter a valid email.")
        .required("Please enter email"),
    otherWorkAddress: yup.boolean(),
    sectorType:yup.string()
        .oneOf(["Private",
                "Non-Profit",
                "Public"],"Please select a valid field.")
        .required('Please select your sector type.'),
    typeOfIndustry:yup.string()
        .required('Please select your industry type.'),
    organizationSize:yup.string()
        .oneOf(["1-49",
                "50-499",
                "500+"],"Please select a valid field.")
        .required('Please select your organization size'),
    cewsParticipation:yup.string()
        .oneOf(["yes",
                "no",
                "notSure"],"Please select a valid field.")
        .required("Please select an answer on whether your organization is actively participating in the CEWS Program"),
    employeeDisplacement:yup.string()
        .oneOf(["yes",
                "no"],"Please select a valid field.")
        .required("Please select an answer on whether your employees have been displaced"),
    labourDispute:yup.string()
        .oneOf(["yes",
                "no"],"Please select a valid field.")
        .required("Please select an answer on whether there is a labour dispute or stoppage"),
    unionConcurrence:yup.string()
        .oneOf(["yes",
                "no",
                "N/A"],"Please select a valid field.")
        .required("Please select an answer on whether there is a union occurrence"),
    liabilityCoverage:yup.string()
        .oneOf(["yes",
                "no"],"Please select a valid field.")
        .required("Please select an answer on whether your organization has 3rd party liability coverage"),
    wageSubsidy:yup.string()
        .oneOf(["yes",
                "no"],"Please select a valid field.")
        .required("Please select an answer on whether your organization is receiving funding under a workBC wage subsidy agreement"),
    WSBCCoverage:yup.string()
        .oneOf(["yes",
                "no"],"Please select a valid field.")
        .required("Please select an answer on whether your organization has WorkSafe BC coverage"),
    eligibility: yup.boolean()
        .oneOf([true],"Required"),

    //step 1:pop-up fields
    employeesClaimed:yup.mixed()
        .when("wageSubsidy",{ 
            is:"yes",
            then: yup.string().oneOf(["1","2","3","4","5","6","7","8","9","10"], "Please choose a valid option.").required("Please select number employees currently subsidized")
        }),
    WSBCNumber: yup.string()
        .when("WSBCCoverage",{
            is:"yes",
            then: yup.string().test('Is valid Number','Invalid WSBC number, format should be: BC0001',
            value => (value +"").match(/^[A-Z]{2}[0-9]{9}$/gi),
            ),
    }),
    addressAlt:yup.string()
        .when("otherWorkAddress",{
            is:true,
            then: yup.string().max(255,"Address too long, please use address line 2.").required("please enter your other work address")
        }),
       
    cityAlt: yup.string()
        .when("otherWorkAddress", {
            is: true,
            then: yup.string().max(100,"City name too long").required("Please enter a city")
        }),    
    provinceAlt:yup.string()
        .when("otherWorkAddress", {
            is: true,
            then: yup.string().required("Please enter a province")
        }),   
    postalAlt:yup.string()
        .when("otherWorkAddress", {
            is: true,
            then: yup.string().matches(/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/,"Please enter a valid Postal Code").required("Please enter a postal code.")
        }),   
    
    //step 2
    operatingName0: yup.string()
        .required('Please enter the Organization name'),
    operatingName1: yup.string()
        .when("checkPositionInstances",{
            is: "1",
            then: yup.string().required('Please enter the Organization name'),
        }),
    /*
    operatingName2: yup.string()
        .when("checkPositionInstances",{
            is: "1",
            then: yup.string().required('Please enter the Organization name'),
        }),
    operatingName3: yup.string()
        .when("checkPositionInstances",{
            is: "1",
            then: yup.string().required('Please enter the Organization name'),
        }),
    operatingName4: yup.string()
        .when("checkPositionInstances",{
            is: "1",
            then: yup.string().required('Please enter the Organization name'),
        }),
    */
    numberOfPositions0:  yup.mixed()
        .oneOf(["1","2","3","4","5"], "Please choose a valid option.")
        .required("Please select number of applicants."),
    numberOfPositions1:  yup.mixed()
        .when("checkPositionInstances",{
            is: "1",
            then: yup.mixed().oneOf(["1","2","3","4","5"], "Please choose a valid option.").required("Please select number of applicants.")
        }),
    numberOfPositions2:  yup.mixed()
        .when("checkPositionInstances",{
            is: "2",
            then: yup.mixed().oneOf(["1","2","3","4","5"], "Please choose a valid option.")
        }),
    numberOfPositions3:  yup.mixed()
        .when("checkPositionInstances",{
            is: "3",
            then: yup.mixed().oneOf(["1","2","3","4","5"], "Please choose a valid option.")
        }),
    numberOfPositions4:  yup.mixed()
        .when("checkPositionInstances",{
            is: "4",
            then: yup.mixed().oneOf(["1","2","3","4","5"], "Please choose a valid option.")
        }),
    
    position0Email0:yup.string().email("Invalid email")
        .when("numberOfPositions0", {
            is: (numberOfPositions0) =>{
                return (numberOfPositions0 > 0);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position0Email1:yup.string().email("Invalid email")
        .when("numberOfPositions0", {
            is: (numberOfPositions0) =>{
                return (numberOfPositions0 > 1);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),

    position0Email2:yup.string().email()
        .when("numberOfPositions0", {
            is: (numberOfPositions0) =>{
                return (numberOfPositions0 > 2);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position0Email3:yup.string().email()
        .when("numberOfPositions0", {
            is: (numberOfPositions0) =>{
                return (numberOfPositions0 > 3);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position0Email4:yup.string().email()
        .when("numberOfPositions0", {
            is: (numberOfPositions0) =>{
                return (numberOfPositions0 > 4);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position1Email0:yup.string().email()
        .when("numberOfPositions1", {
            is: (numberOfPositions1) =>{
                return (numberOfPositions1 > 0);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position1Email1:yup.string().email()
        .when("numberOfPositions1", {
            is: (numberOfPositions1) =>{
                return (numberOfPositions1 > 1);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position1Email2:yup.string().email()
        .when("numberOfPositions1", {
            is: (numberOfPositions1) =>{
                return (numberOfPositions1 > 2);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position1Email3:yup.string().email()
        .when("numberOfPositions1", {
            is: (numberOfPositions1) =>{
                return (numberOfPositions1 > 3);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position2Email0:yup.string().email()
        .when("numberOfPositions2", {
            is: (numberOfPositions2) =>{
                return (numberOfPositions2 > 0);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position2Email1:yup.string().email()
        .when("numberOfPositions2", {
            is: (numberOfPositions2) =>{
                return (numberOfPositions2 > 1);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position2Email2:yup.string().email()
        .when("numberOfPositions2", {
            is: (numberOfPositions2) =>{
                return (numberOfPositions2 > 2);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position3Email0:yup.string().email()
        .when("numberOfPositions3", {
            is: (numberOfPositions3) =>{
                return (numberOfPositions3 > 0);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position3Email1:yup.string().email()
        .when("numberOfPositions3", {
            is: (numberOfPositions3) =>{
                return (numberOfPositions3 > 1);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    position4Email0:yup.string().email()
        .when("numberOfPositions4", {
            is: (numberOfPositions4) =>{
                return (numberOfPositions4 > 0);
            },
            then: yup.string().email("Invalid Email").required("An employee email is required")
        }),
    startDate0: yup.date()
        .min(new Date(), "Date must be after today")
        .required("Please Enter your start date"),
    startDate1:yup.date()
        .when("checkPositionInstances",{
            is: "1",
            then: yup.date().min(new Date(), 'Date must be after today').required("Please Enter your start date")
        }),
    startDate2:yup.date()
        .when("checkPositionInstances",{
            is: "2",
            then: yup.date().min(new Date(), 'Date must be after today').required("Please Enter your start date")
        }),      
    startDate3:yup.date()
        .when("checkPositionInstances",{
            is: "3",
            then: yup.date().min(new Date(), 'Date must be after today').required("Please Enter your start date")
        }),
    startDate4:yup.date()
        .when("checkPositionInstances",{
            is: "4",
            then: yup.date().min(new Date(), 'Date must be after today').required("Please Enter your start date")
        }),
    hours0:yup.number().test(
        'is-decimal',
        'invalid decimal',
        value => (value +"").match(/^\d*.{1}\d*$/),)
        .typeError("Must be a decimal number")
        .max(50, "Max hours per week is 50.")
        .required('Please enter your employees hours per week.'),
    hours1:yup.number()
        .when("checkPositionInstances",{
            is: "1",
            then: yup.number().test(
        'is-decimal',
        'invalid decimal',
        value => (value +"").match(/^\d*.{1}\d*$/),)
        .typeError("Must be a decimal number")
        .max(50, "Max hours per week is 50.")
        .required('Please enter your employees hours per week.'),
        }),
    hours2:yup.number()
        .when("checkPositionInstances",{
            is: "2",
            then: yup.number().test(
        'is-decimal',
        'invalid decimal',
        value => (value +"").match(/^\d*.{1}\d*$/),)
        .typeError("Must be a decimal number")
        .max(50, "Max hours per week is 50.")
        .required('Please enter your employees hours per week.'),
        }),
    hours3:yup.number()
        .when("checkPositionInstances",{
            is: "3",
            then: yup.number().test(
        'is-decimal',
        'invalid decimal',
        value => (value +"").match(/^\d*.{1}\d*$/),)
        .typeError("Must be a decimal number")
        .max(50, "Max hours per week is 50.")
        .required('Please enter your employees hours per week.'),
        }),
    hours4:yup.number()
        .when("checkPositionInstances",{
            is: "4",
            then: yup.number().test(
        'is-decimal',
        'invalid decimal',
        value => (value +"").match(/^\d*.{1}\d*$/),)
        .typeError("Must be a decimal number")
        .max(50, "Max hours per week is 50.")
        .required('Please enter your employees hours per week.'),
        }),
    wage0:yup.number().test(
        'is-decimal',
        'invalid decimal',
        value => (value +"").match(/^\d*.{1}\d*$/),)
        .typeError("Must be a decimal number")
        .required("Please enter your employees wage"),
    wage1:yup.number()
        .when("checkPositionInstances",{
            is: "1",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value +"").match(/^\d*.{1}\d*$/),)
                .typeError("must be a decimal number")
                .required("Please enter your employees wage")
        }),  
    wage2:yup.number()
        .when("checkPositionInstances",{
            is: "2",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value +"").match(/^\d*.{1}\d*$/),)
                .typeError("must be a decimal number")
                .required("Please enter your employees wage")
        }),  
    wage3:yup.number()
        .when("checkPositionInstances",{
            is: "3",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value +"").match(/^\d*.{1}\d*$/),)
                .typeError("must be a decimal number")
                .required("Please enter your employees wage")
        }),  
    wage4:yup.number()
        .when("checkPositionInstances",{
            is: "4",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value +"").match(/^\d*.{1}\d*$/),)
                .typeError("must be a decimal number")
                .required("Please enter your employees wage")
        }),  
    duties0:yup.string()
        .max(500, "this field is limited to 500 characters")
        .required('Please enter a description of the duties your employee will be tasked with.'),
    duties1:yup.string()
        .when("checkPositionInstances",{
            is: "1",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the duties your employee will be tasked with.')
        }),  
    duties2:yup.string()
        .when("checkPositionInstances",{
            is: "2",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the duties your employee will be tasked with.')
        }),  
    duties3:yup.string()
        .when("checkPositionInstances",{
            is: "3",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the duties your employee will be tasked with.')
        }),  
    duties4:yup.string()
        .when("checkPositionInstances",{
            is: "4",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the duties your employee will be tasked with.')
        }),  
    signatoryTitle: yup.string()
        .required("Please enter the title of the organization signatory.")
        .test('match','Signatories must be different',function (signatoryTitle){
            return signatoryTitle !== this.options.parent.signatory1
        }),   
    signatory1: yup.string()
        .required("Please enter the full name of the organization signatory."),
    organizationConsent: yup.boolean()
        .oneOf([true],"Required"),
})