class HttpError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message); // add a "message" property
    this.code = code; // add a "code" property
  }
}

export default HttpError;