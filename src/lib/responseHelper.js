const _ = require('lodash')


class Success {
    statusCode = 200
    responseType = 'success'
    defaultMessage = 'Success.'
    items = []

    constructor(data) {
        if (_.isString(data)) {
            this.defaultMessage = data
        } else if (data) {
            const { items, message } = data

            if (items && !_.isArray(items)) {
                this.items = [items]
            } else {
                this.items = items
            }

            if (message) {
                this.defaultMessage = message
            }
        }
    }

    overrideMessage(message) {
        if (_.isString(message)) {
            this.defaultMessage = message
        } else if (data) {
            const { message } = data
            this.defaultMessage = message
        }
    }
}

class ApiError {
    statusCode = 500
    responseType = 'error'
    defaultMessage = 'Error.'
    errors = []

    constructor(data) {
        // console.log(data);
        if (_.isArray(data)) {
            this.errors = data
        } else if (_.isString(data)) {
            this.errors.push(data)
        } else if (_.isError(data)) {
            this.errors.push(data.toString())
        }
    }
}


class LoginSuccess extends Success {
    defaultMessage = 'Login Successful.'
    token = null

    constructor(data) {
        super(data)
        this.token = data
    }
}

class Created extends Success {
    statusCode = 201
    defaultMessage = 'Created.'

    constructor(data) {
        super(data)
        this.overrideMessage(data)
    }
}

class BadRequest extends ApiError {
    statusCode = 400
    defaultMessage = 'Bad Request.'

    constructor(data) {
        super(data)
    }
}

class NotFound extends ApiError {
    statusCode = 404
    defaultMessage = 'Not Found.'

    constructor(data) {
        super(data)
    }
}

class Unauthorized extends ApiError {
    statusCode = 401
    defaultMessage = 'Unauthorized.'

    constructor(data) {
        super(data)
    }
}

class Conflict extends ApiError {
    statusCode = 409
    defaultMessage = 'Conflict.'

    constructor(data) {
        super(data)
    }
}

class UnprocessableEntity extends ApiError {
    statusCode = 422
    defaultMessage = 'Unprocessable entity.'

    constructor(data) {
        super(data)
    }
}

class InvalidMongoId extends UnprocessableEntity {
    defaultMessage = 'Invalid Mongo Id.'

    constructor(data) {
        super(data)
    }
}





function _craftJSON(ResponseClass) {
    if (ResponseClass.responseType === 'error') {
        return {
            data: {
                message: ResponseClass.defaultMessage,
                error: ResponseClass.errors?.length ? ResponseClass.errors : undefined
            }
        }
    } else {
        return {
            data: {
                message: ResponseClass.defaultMessage,
                token: ResponseClass.token ? ResponseClass.token : undefined,
                items: ResponseClass.items?.length ? ResponseClass.items : undefined
            }
        }
    }


}

module.exports = (res, response, type = 'Success') => {
    let ResponseClass = null

    try {
        const evaluatedResponseClass = type
        switch (evaluatedResponseClass) {
            case 'Success':
                ResponseClass = new Success(response)
                break

            case 'Error':
                ResponseClass = new ApiError(response)
                break

            case 'LoginSuccess':
                ResponseClass = new LoginSuccess(response)
                break

            case 'Created':
                ResponseClass = new Created(response)
                break

            case 'Unauthorized':
                ResponseClass = new Unauthorized(response)
                break

            case 'BadRequest':
                ResponseClass = new BadRequest(response)
                break

            case 'NotFound':
                ResponseClass = new NotFound(response)
                break

            case 'UnprocessableEntity':
                ResponseClass = new UnprocessableEntity(response)
                break

            case 'Conflict':
                ResponseClass = new Conflict(response)
                break

            case 'InvalidMongoId':
                ResponseClass = new InvalidMongoId(response)
                break

            default:
                ResponseClass = new ApiError(Error('Invalid Response Type.'))
        }
    } catch (error) {
        ResponseClass = new Error(error)
    } finally {
        return res.status(ResponseClass.statusCode).json(_craftJSON(ResponseClass))
    }

}