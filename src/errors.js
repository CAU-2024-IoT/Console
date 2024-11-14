export class DuplicateUserEmailError extends Error {
  errorCode = "U001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserNotFoundError extends Error {
  errorCode = "U002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserIdError extends Error {
    errorCode = "U003";

    constructor(reason, data) {
        super(reason);
        this.reason = reason;
        this.data = data;
      }
}

export class StoreNotFoundError extends Error {
    errorCode = "U011";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }

export class MissionNotFoundError extends Error {
  errorCode = "U021";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateMissionError extends Error {
    errorCode = "U022";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  }