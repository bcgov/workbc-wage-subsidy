import * as yup from 'yup';
import "yup-phone";


export const ClaimFormValidationSchema = yup.object().shape({
    periodStart1: yup.date().required(),
    periodStart2: yup.date().required().min(
        yup.ref('periodStart1'), 'End date cannot be before start date'
    ),
    isFinalClaim: yup.boolean().required(),
    employerName: yup.string().required("Please enter the employer's business name"),
    employerContact: yup.string().required("Please enter a contact name"),
    employerPhone: yup.string()
        .phone("CA", false, "Please enter a valid number.")
        .required("Please enter phone number"),
    employerAddress1: yup.string()
        .max(255, "Address too long, please use address line 2.").required(),
    employerAddress2: yup.string()
        .max(255, "Address too long"),
    employerCity: yup.string()
        .max(100, "City name too long")
        .required("Please enter city"),
    employerPostal: yup.string()
        .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Please enter a valid Postal Code")
        .required("Please enter a postal code."),
    employeeFirstName: yup.string().required(),
    employeeLastName: yup.string().required(),
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
});