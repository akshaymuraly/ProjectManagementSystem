class CustomError extends Error {
  constructor(message, status_code) {
    super(message);
    this.message = message;
    this.status = status_code;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  CustomError,
};
