import * as yup from 'yup';
import "yup-phone";


export const ClaimFormValidationSchema = yup.object().shape({
    periodStart1: yup.date().required("Please enter a starting date"),
    periodStart2: yup.date().required("Please enter an ending date").min(
        yup.ref('periodStart1'), 'End date cannot be before start date'
    ),
    isFinalClaim: yup.string().required("Please select an option"),
    employerName: yup.string().required("Please enter the employer's business name"),
    employerContact: yup.string().required("Please enter a contact name"),
    employerPhone: yup.string()
        .phone("CA", false, "Please enter a valid number.")
        .required("Please enter phone number"),
    employerAddress1: yup.string()
        .max(255, "Address too long, please use address line 2.").required("Please enter an address"),
    employerAddress2: yup.string()
        .max(255, "Address too long"),
    employerCity: yup.string()
        .max(100, "City name too long")
        .required("Please enter city"),
    employerPostal: yup.string()
        .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Please enter a valid Postal Code")
        .required("Please enter a postal code."),
    employeeFirstName: yup.string().required("Please enter a first name"),
    employeeLastName: yup.string().required("Please enter a last ame"),
    clientIssues1: yup.string().max(700),
    dateFrom1: yup.date(),
    hoursWorked1: yup.number(),
    hourlyWage1: yup.number(),
    total1: yup.number(),
    clientIssues2: yup.string().max(700),
    dateFrom2: yup.date(),
    hoursWorked2: yup.number(),
    hourlyWage2: yup.number(),
    total2: yup.number(),
    clientIssues3: yup.string().max(700),
    dateFrom3: yup.date(),
    hoursWorked3: yup.number(),
    hourlyWage3: yup.number(),
    total3: yup.number(),
    clientIssues4: yup.string().max(700),
    dateFrom4: yup.date(),
    hoursWorked4: yup.number(),
    hourlyWage4: yup.number(),
    total4: yup.number(),
    clientIssues5: yup.string().max(700),
    dateFrom5: yup.date(),
    hoursWorked5: yup.number(),
    hourlyWage5: yup.number(),
    total5: yup.number(),
    workbcCentre: yup.string()
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
        ], "Please select your WorkBC Centre.")
        .required("Please select your WorkBC Centre.")
});