import * as yup from 'yup'
import "yup-phone"
import 'core-js/stable';


export const NeedEmployeeValidationSchema = yup.object().shape({
    //step 1
    _ca: yup.string()
        .oneOf([
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31",
            "32",
            "33",
            "34",
            "35",
            "36",
            "37",
            "38",
            "39",
            "40",
            "41",
            "42",
            "43",
            "44",
            "45",
        ], "Please verify your workplace or organization address.")
        .required("Please verify your workplace or organization address."),
    operatingName: yup.string()
        .required('Please enter the Organization name'),
    businessNumber: yup.string()
        .matches(/^[0-9]{9}[A-Z]{2}[0-9]{4}$/gi, "Number is Incorrect should be in the form: 123456789BC0001 ")
        .max(15, "Business number must be exactly 15 characters")
        .min(15, "Business number must be exactly 15 characters.")
        .required('Please enter your business number.'),
    businessAddress: yup.string()
        .max(255, "Address too long")
        .required("please enter your organizations address"),
    businessCity: yup.string()
        .max(100, "City name too long")
        .required("please enter your organizations city"),
    businessProvince: yup.string()
        .required("Please enter a valid province"),
    businessPostal: yup.string()
        .matches(/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/, "Please enter a valid Postal Code")
        .required("Please enter a valid Postal Code"),
    businessPhone: yup.string()
        .test('Is-valid-phone','Invalid phone',
        value => (value +"").match(/^\d{3}-\d{3}-\d{4}$/gi))
        .required("Please enter phone."),
    businessFax: yup.string().test('Is-valid-fax', 'Invalid fax',
        value => (value + "").match(/^\d{1}-\d{3}-\d{3}-\d{4}$/gi) || value === undefined,
    ),
    businessEmail: yup.string().email("Please enter a valid email.")
        .required("Please enter email"),
    otherWorkAddress: yup.boolean(),
    sectorType: yup.string()
        .oneOf(["Private",
            "Non-Profit",
            "Public"], "Please select a valid field.")
        .required('Please select your sector type.'),
    typeOfIndustry: yup.string()
        .required('Please select your industry type.'),
    organizationSize: yup.string()
        .oneOf(["1-49",
                "50-499",
                "500+"], "Please select a valid field.")
        .required('Please select your organization size'),
    cewsParticipation: yup.string()
        .oneOf(["yes",
            "no",
            "notSure"], "Please select a valid field.")
        .required("Please select an answer on whether your organization is actively participating in the CEWS Program"),
    employeeDisplacement: yup.string()
        .oneOf(["yes",
            "no"], "Please select a valid field.")
        .required("Please select an answer on whether your employees have been displaced"),
    labourDispute: yup.string()
        .oneOf(["yes",
            "no"], "Please select a valid field.")
        .required("Please select an answer on whether there is a labour dispute or stoppage"),
    unionConcurrence: yup.string()
        .oneOf(["yes",
            "no",
            "N/A"], "Please select a valid field.")
        .required("Please select an answer on whether there is a union occurrence"),
    liabilityCoverage: yup.string()
        .oneOf(["yes",
            "no"], "Please select a valid field.")
        .required("Please select an answer on whether your organization has 3rd party liability coverage"),
    wageSubsidy: yup.string()
        .oneOf(["yes",
            "no"], "Please select a valid field.")
        .required("Please select an answer on whether your organization is receiving funding under a workBC wage subsidy agreement"),
    WSBCCoverage: yup.string()
        .oneOf(["yes",
            "no"], "Please select a valid field.")
        .required("Please select an answer on whether your organization has WorkSafe BC coverage"),
    eligibility: yup.boolean()
        .oneOf([true], "Required"),

    //step 1:pop-up fields
    employeesClaimed: yup.mixed()
        .when("wageSubsidy", {
            is: "yes",
            then: yup.string().oneOf(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], "Please choose a valid option.").required("Please select number employees currently subsidized")
        }),
    WSBCNumber: yup.string()
        .when("WSBCCoverage", {
            is: "yes",
            then: yup.string().test('Is valid Number', 'Invalid WSBC number, format should be: BC0001',
                value => (value + "").match(/^[A-Z]{2}[0-9]+$/gi),
            ),
        }),
    addressAlt: yup.string()
        .when("otherWorkAddress", {
            is: true,
            then: yup.string().max(255, "Address too long, please use address line 2.").required("please enter your other work address")
        }),

    cityAlt: yup.string()
        .when("otherWorkAddress", {
            is: true,
            then: yup.string().max(100, "City name too long").required("Please enter a city")
        }),
    provinceAlt: yup.string()
        .when("otherWorkAddress", {
            is: true,
            then: yup.string().required("Please enter a province")
        }),
    postalAlt: yup.string()
        .when("otherWorkAddress", {
            is: true,
            then: yup.string().matches(/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/, "Please enter a valid Postal Code").required("Please enter a postal code.")
        }),

    //step 2
    operatingName0: yup.string()
        .required('Please enter the Organization name'),
    operatingName1: yup.string()
        .when("checkPositionInstances", {
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
    numberOfPositions0: yup.mixed()
        .oneOf(["1", "2", "3", "4", "5"], "Please choose a valid option.")
        .required("Please select number of applicants."),
    numberOfPositions1: yup.mixed()
        .when("checkPositionInstances", {
            is: "1",
            then: yup.mixed().oneOf(["1", "2", "3", "4", "5"], "Please choose a valid option.").required("Please select number of applicants.")
        }),
    numberOfPositions2: yup.mixed()
        .when("checkPositionInstances", {
            is: "2",
            then: yup.mixed().oneOf(["1", "2", "3", "4", "5"], "Please choose a valid option.")
        }),
    numberOfPositions3: yup.mixed()
        .when("checkPositionInstances", {
            is: "3",
            then: yup.mixed().oneOf(["1", "2", "3", "4", "5"], "Please choose a valid option.")
        }),
    numberOfPositions4: yup.mixed()
        .when("checkPositionInstances", {
            is: "4",
            then: yup.mixed().oneOf(["1", "2", "3", "4", "5"], "Please choose a valid option.")
        }),
    startDate0: yup.date()
        .min(new Date(), "Date must be after today")
        .required("Please Enter your start date"),
    startDate1: yup.date()
        .when("checkPositionInstances", {
            is: "1",
            then: yup.date().min(new Date(), 'Date must be after today').required("Please Enter your start date")
        }),
    startDate2: yup.date()
        .when("checkPositionInstances", {
            is: "2",
            then: yup.date().min(new Date(), 'Date must be after today').required("Please Enter your start date")
        }),
    startDate3: yup.date()
        .when("checkPositionInstances", {
            is: "3",
            then: yup.date().min(new Date(), 'Date must be after today').required("Please Enter your start date")
        }),
    startDate4: yup.date()
        .when("checkPositionInstances", {
            is: "4",
            then: yup.date().min(new Date(), 'Date must be after today').required("Please Enter your start date")
        }),
    hours0: yup.number().test(
        'is-decimal',
        'invalid decimal',
        value => (value + "").match(/^\d*.{1}\d*$/))
        .typeError("Must be a decimal number")
        .required('Please enter your employees hours per week.'),
    hours1: yup.number()
        .when("checkPositionInstances", {
            is: "1",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^\d*.{1}\d*$/))
                .typeError("Must be a decimal number")
                .required('Please enter your employees hours per week.'),
        }),
    hours2: yup.number()
        .when("checkPositionInstances", {
            is: "2",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^\d*.{1}\d*$/))
                .typeError("Must be a decimal number")
                .required('Please enter your employees hours per week.'),
        }),
    hours3: yup.number()
        .when("checkPositionInstances", {
            is: "3",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^\d*.{1}\d*$/))
                .typeError("Must be a decimal number")
                .required('Please enter your employees hours per week.'),
        }),
    hours4: yup.number()
        .when("checkPositionInstances", {
            is: "4",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^\d*.{1}\d*$/))
                .typeError("Must be a decimal number")
                .required('Please enter your employees hours per week.'),
        }),
    wage0: yup.number().test(
        'is-decimal',
        'invalid decimal',
        value => (value + "").match(/^\d*.{1}\d*$/))
        .typeError("must be a decimal number")
        .required("Please enter your employees wage"),
    wage1: yup.number()
        .when("checkPositionInstances", {
            is: "1",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^\d*.{1}\d*$/))
                .typeError("must be a decimal number")
                .required("Please enter your employees wage")
        }),
    wage2: yup.number()
        .when("checkPositionInstances", {
            is: "2",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^\d*.{1}\d*$/))
                .typeError("must be a decimal number")
                .required("Please enter your employees wage")
        }),
    wage3: yup.number()
        .when("checkPositionInstances", {
            is: "3",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^\d*.{1}\d*$/))
                .typeError("must be a decimal number")
                .required("Please enter your employees wage")
        }),
    wage4: yup.number()
        .when("checkPositionInstances", {
            is: "4",
            then: yup.number().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^\d*.{1}\d*$/))
                .typeError("must be a decimal number")
                .required("Please enter your employees wage")
        }),
    duties0: yup.string()
        .max(500, "this field is limited to 500 characters")
        .required('Please enter a description of the duties your employee will be tasked with.'),
    duties1: yup.string()
        .when("checkPositionInstances", {
            is: "1",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the duties your employee will be tasked with.')
        }),
    duties2: yup.string()
        .when("checkPositionInstances", {
            is: "2",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the duties your employee will be tasked with.')
        }),
    duties3: yup.string()
        .when("checkPositionInstances", {
            is: "3",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the duties your employee will be tasked with.')
        }),
    duties4: yup.string()
        .when("checkPositionInstances", {
            is: "4",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the duties your employee will be tasked with.')
        }),
    skills0: yup.string()
        .max(500, "this field is limited to 500 characters")
        .required('Please enter a description of the skills your employee should have.'),
    skills1: yup.string()
        .when("checkPositionInstances", {
            is: "1",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the skills your employee should have.')
        }),
    skills2: yup.string()
        .when("checkPositionInstances", {
            is: "2",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the skills your employee should have.')
        }),
    skills3: yup.string()
        .when("checkPositionInstances", {
            is: "3",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the skills your employee should have.')
        }),
    skills4: yup.string()
        .when("checkPositionInstances", {
            is: "4",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the skills your employee should have.')
        }),
    workExperience0: yup.string()
        .max(500, "this field is limited to 500 characters")
        .required('Please enter a description of the workExperience your employee should have.'),
    workExperience1: yup.string()
        .when("checkPositionInstances", {
            is: "1",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the workExperience your employee should have.')
        }),
    workExperience2: yup.string()
        .when("checkPositionInstances", {
            is: "2",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the workExperience your employee should have.')
        }),
    workExperience3: yup.string()
        .when("checkPositionInstances", {
            is: "3",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the workExperience your employee should have.')
        }),
    workExperience4: yup.string()
        .when("checkPositionInstances", {
            is: "4",
            then: yup.string().max(500, "this field is limited to 500 characters").required('Please enter a description of the workExperience your employee should have.')
        }),
    signatoryTitle: yup.string()
        .required("Please enter the title of the organization signatory.")
        .test('match', 'Signatories must be different', function (signatoryTitle) {
            return signatoryTitle !== this.options.parent.signatory1
        }),
    signatory1: yup.string()
        .required("Please enter the full name of the organization signatory."),
    organizationConsent: yup.boolean()
        .oneOf([true], "Required"),
    workbcCentre: yup.string()
        .when("workingWithWorkBCCentre",{
            is: "yes",
            then: yup.string()
        .oneOf([
            "01-0",
            "01-1",
            "02-2",
            "02-3",
            "03-4",
            "03-5",
            "03-6",
            "03-7",
            "04-8",
            "05-9",
            "05-10",
            "06-11",
            "06-12",
            "07-13",
            "07-14",
            "08-15",
            "08-16",
            "09-17",
            "09-18",
            "10-19",
            "11-20",
            "11-21",
            "11-22",
            "12-23",
            "12-24",
            "13-25",
            "14-26",
            "15-27",
            "16-28",
            "17-29",
            "17-30",
            "17-31",
            "18-32",
            "18-33",
            "19-34",
            "19-35",
            "20-36",
            "21-37",
            "22-38",
            "23-39",
            "23-40",
            "24-41",
            "24-42",
            "24-43",
            "25-44",
            "26-45",
            "27-46",
            "28-47",
            "28-48",
            "28-49",
            "29-50",
            "29-51",
            "29-52",
            "29-53",
            "30-54",
            "30-55",
            "30-56",
            "31-57",
            "31-58",
            "31-59",
            "31-60",
            "31-61",
            "32-62",
            "32-63",
            "32-64",
            "32-65",
            "33-66",
            "33-67",
            "33-68",
            "34-69",
            "34-70",
            "34-71",
            "34-72",
            "35-73",
            "35-74",
            "35-75",
            "36-76",
            "36-77",
            "36-78",
            "37-79",
            "37-80",
            "37-81",
            "38-82",
            "38-83",
            "39-84",
            "39-85",
            "39-86",
            "40-87",
            "40-88",
            "41-89",
            "41-90",
            "42-91",
            "42-92",
            "42-93",
            "43-94",
            "43-95",
            "43-96",
            "44-97",
            "44-98",
            "45-99",
            "45-100",
            "15-1",
        ], "Please select the WorkBC Centre you are working with.")
        .required("Please select the WorkBC Centre you are working with.")
    })
})