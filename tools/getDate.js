module.exports = (format = "mm-dd-yyyy") => {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    switch (format) {
        case "mm-dd-yyyy":
            today = mm + '-' + dd + '-' + yyyy;
            break;
        case "mm/dd/yyyy":
            today = mm + '/' + dd + '/' + yyyy;
            break;
        case "dd-mm-yyyy":
            today = dd + '-' + mm + '-' + yyyy;
            break;
        case "dd/mm/yyyy":
            today = dd + '/' + mm + '/' + yyyy;
            break;
    }
    return today;
}