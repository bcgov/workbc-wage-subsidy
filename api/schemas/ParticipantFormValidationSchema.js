var yup = require('yup')
require('yup-phone')

var ParticipantFormValidationSchema = yup.object().shape({
    applicationId: yup.string()
        .required("Please enter the application ID.")
        .min(10, "Must be 10 characters")
        .max(10, "Must be 10 characters"),
    existingWorkBCClient: yup.string()
        .oneOf(["yes","no"])
        .required("Please select"),
    participantFirstName: yup.string()
        .max(10)
        .required("Please enter first name."),
    participantLastName: yup.string()
        .required("Please enter last name"),
    participantDOB: yup.date()
        .max(new Date())
        .required("Please enter your date of birth."),    
    participantConsent: yup.boolean()
        .oneOf([true],"You must agree before submitting.")
});

module.exports = ParticipantFormValidationSchema;