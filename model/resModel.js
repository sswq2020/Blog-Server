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

function createSuccessData(data,meassage){
    let instance = new SuccessModel(data,meassage);
    return instance;
}

function createErrorData(data,meassage){
    let instance = new SuccessModel(data,meassage);
    return instance;
}

module.exports = {
    SuccessModel,
    ErrorModel,
    createSuccessData,
    createErrorData
}