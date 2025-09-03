import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }

    const extractError = []
    errors.array().map((error) => {
        extractError.push({
            filePath: error.path,
            message: error.msg
        })
    })

    console.error("Validation Error", extractError);
    
    throw new ApiError(422, "Recieved data is not valid: ", extractError)
}