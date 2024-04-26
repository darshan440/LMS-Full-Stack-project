class ErrorHandler extends Error {
  statusCode: number; // Change 'Number' to 'number'
  constructor(message: any, statusCode: number) {
    // Change 'Number' to 'number'
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
