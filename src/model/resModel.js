class BaseModel {
    constructor(data, meassage) {
        if (typeof data === 'string') {
            this.meassage = data
            data = null
            meassage = null
        }
        if (data) {
            this.data = data
        }
        if (meassage) {
            this.meassage = meassage
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data,meassage) {
        super(data,meassage)
        this.errno = 0
    }

}

class ErrorModel extends BaseModel {
    constructor(data,meassage) {
        super(data,meassage)
        this.errno = -1
    }

}

module.exports = {
    SuccessModel,
    ErrorModel
}