// USER ERROR : U001~U001
export class UserNotFoundError extends Error {
  errorCode = "U001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// USER ERROR : B001~B001
export class BookNotFoundError extends Error {
  errorCode = "B001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
