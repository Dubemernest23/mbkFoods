const httpStatus = require("../constants/httpStatus")

function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        if (!result.success) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "Validation failed",
                errors: result.error.flatten()
            });
        }

        req.validated = result.data;
        return next();
    };
}

module.exports = validate;
