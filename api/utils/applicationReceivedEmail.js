var strings = require("./strings")

module.exports = {

    generateNotification: function (values) {

        var html = /*html*/`

    `
        return html
    },

    generateListNotification: function(values) {
        var html = "";
        // loop through each property
        for (var key in values) {
            // add key/val to html
            html += `<p><b>${key}:</b> ${strings.orEmpty(values[key])}</p>`;
        }

        return html;
    },

    generateClaimNotification: function (values){
        var html = /*html*/`

        `

        return html       
    },

    generateClaimListNotification: function(values){
        var html = `

        `
        return html
    }

}