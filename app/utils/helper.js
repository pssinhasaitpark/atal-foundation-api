(exports.successResponse = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    status: "success",
    message: message || "Operation completed successfully.",
    data: data,
  });
}),
  (exports.errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
      message: message.details
        ? message.details[0]
        : message || "An error occurred while processing your request.",
      error: true,
    });
  });

exports.handleResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    status: statusCode,
    message: message,
    ...data,
  });
};
