module.exports = class CheckCustomer {
    //check formate of email
    checkEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = re.test(email);
        return result;
    }

    //check null value
    checkNull(data) {
        for (var key in data) {
            // If not null
            return false;
        }
        // If null
        return true;
    }

    //check file size
    checkFileSize(fileSize) {
        var maxSize = 1 * 1024 * 1024; //1MB
        if (fileSize > maxSize) {
            return true;
        }
        return false;
    }
    
    //check extension in (jpg, jpeg, png)
    checkFileType(fileType) {
        if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg') {
            return true;
        }
        return false;
    }
}