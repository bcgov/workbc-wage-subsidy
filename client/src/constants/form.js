export const FORM_URL = {
    mainForm: '',
    clientForm: '',
}

if (process.env.NODE_ENV === 'development'){
    FORM_URL.mainForm = 'http://localhost:8000/api/form'
    FORM_URL.clientForm = 'http://localhost:8000/api/participantForm'
} else if (process.env.NODE_ENV === 'production') {
    FORM_URL.mainForm = '/api/form'
    FORM_URL.clientForm = '/api/participantForm'  
}