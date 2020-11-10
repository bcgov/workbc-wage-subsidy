function formatDate(date){
    if (date !== "" && typeof date !== "undefined" && date !== null){
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    } else {
        return ""
    }
}

module.exports = formatDate