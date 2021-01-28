import * as yup from 'yup';
import "yup-phone";


export const ClaimFormValidationSchema = yup.object().shape({
    periodStart1: yup.date().required("Please enter a starting date")
        .max(yup.ref('periodStart2'),'Start date cannot be after end date'),
    periodStart2: yup.date().required("Please enter an ending date").min(
        yup.ref('periodStart1'), 'End date cannot be before start date'),
    isFinalClaim: yup.string().required("Please select option for Is final claim?"),
    employerName: yup.string().required("Please enter the employer's business name"),
    employerContact: yup.string().required("Please enter a contact name"),
    employerPhone: yup.string()
        .test('Is-valid-phone','Invalid phone',
        value => (value +"").match(/^\d{3}-\d{3}-\d{4}$/gi))
        .required("Please enter phone number"),
    employerAddress1: yup.string()
        .max(255, "Address too long, please use address line 2.").required("Please enter an address"),
    employerAddress2: yup.string()
        .max(255, "Address too long"),
    employerCity: yup.string()
        .max(100, "City name too long")
        .required("Please enter city"),
    employerPostal: yup.string()
        .matches(/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/, "Please enter a valid Postal Code")
        .required("Please enter a postal code."),
    employeeFirstName: yup.string().required("Please enter a first name"),
    employeeLastName: yup.string().required("Please enter a last ame"),
    clientIssues1: yup.string().max(700),
    dateFrom1: yup.date()
        .min(yup.ref('periodStart1'),'Date From must be on or after the period start date.')
        .max(yup.ref('periodStart2'),'Date From must be on or before the period end date.')
        .required("You must provide at least one line for date from."),
    dateTo1: yup.date()
        .min(yup.ref('dateFrom1'),'Date To cannot be before Date From.')
        .max(yup.ref('periodStart2'),'Date To must be on or before the period end date.')
        .required("You must provide at least one line for date to."),
    hoursWorked1: yup.number()
        .typeError("Hours worked must be a number.")
        .required("Please enter at least one line for hours worked."),
    hourlyWage1: yup.number()
        .typeError("Hourly wage must be a number.")
        .required("Please enter at least one line for hourly wage."),
    total1: yup.number(),
    clientIssues2: yup.string().max(700),
    dateFrom2: yup.date()
        .min(yup.ref('periodStart1'),'Date From must be on or after the period start date.')
        .max(yup.ref('periodStart2'),'Date From must be on or before the period end date.'),
    dateTo2: yup.date()
        .min(yup.ref('dateFrom2'),'Date To cannot be before Date From.')
        .max(yup.ref('periodStart2'),'Date To must be on or before the period end date.'),
    hoursWorked2: yup.number()
        .typeError("Hours worked must be a number."),
    hourlyWage2: yup.number()
        .typeError("Hourly wage must be a number."),
    total2: yup.number(),
    clientIssues3: yup.string().max(700),
    dateFrom3: yup.date()
        .min(yup.ref('periodStart1'),'Date From must be on or after the period start date.')
        .max(yup.ref('periodStart2'),'Date From must be on or before the period end date.'),
    dateTo3: yup.date()
        .min(yup.ref('dateFrom3'),'Date To cannot be before Date From.')
        .max(yup.ref('periodStart2'),'Date To must be on or before the period end date.'),
    hoursWorked3: yup.number()
        .typeError("Hours worked must be a number."),
    hourlyWage3: yup.number()
        .typeError("Hourly wage must be a number."),
    total3: yup.number(),
    clientIssues4: yup.string().max(700),
    dateFrom4: yup.date()
        .min(yup.ref('periodStart1'),'Date From must be on or after the period start date.')
        .max(yup.ref('periodStart2'),'Date From must be on or before the period end date.'),
    dateTo4: yup.date()
        .min(yup.ref('dateFrom4'),'Date To cannot be before Date From.')
        .max(yup.ref('periodStart2'),'Date To must be on or before the period end date.'),
    hoursWorked4: yup.number()
        .typeError("Hours worked must be a number."),
    hourlyWage4: yup.number()
        .typeError("Hourly wage must be a number."),
    total4: yup.number(),
    clientIssues5: yup.string().max(700),
    dateFrom5: yup.date()
        .min(yup.ref('periodStart1'),'Date From must be on or after the period start date.')
        .max(yup.ref('periodStart2'),'Date From must be on or before the period end date.'),
    dateTo5: yup.date()
        .min(yup.ref('dateFrom5'),'Date To cannot be before Date From.')
        .max(yup.ref('periodStart2'),'Date To must be on or before the period end date.'),
    hoursWorked5: yup.number()
        .typeError("Hours worked must be a number."),
    hourlyWage5: yup.number()
        .typeError("Hourly wage must be a number."),
    totalMERCs: yup.number()
        .typeError("Total MERCs must be a number.")
        .required("Please enter total MERCs for claim period."),
    total5: yup.number(),
    workbcCentre: yup.string()
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
        ], "Please select your WorkBC Centre.")
        .required("Please select your WorkBC Centre."),
    signatory1: yup.string()
        .max(100, "Please shorten the signatory name.")
        .required("Please certify information is true and correct.")
});