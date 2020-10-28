export const FORM_URL = {
    haveEmployeeForm: '',
    needEmployeeForm: '',
    claimForm: '',
    clientForm: '',
}

if (process.env.NODE_ENV === 'development'){
    FORM_URL.haveEmployeeForm = 'http://localhost:8000/api/haveEmployeeForm'
    FORM_URL.clientForm = 'http://localhost:8000/api/participantForm'
    FORM_URL.claimForm = 'http://localhost:8000/api/claimForm'
} else if (process.env.NODE_ENV === 'production') {
    FORM_URL.mainForm = '/api/form'
    FORM_URL.clientForm = '/api/participantForm'  
    FORM_URL.claimForm = '/api/clientForm'
}