export class FailedToFetchError extends Error {
  constructor(message = "We couldn't get the data you requested :(") {
    super(message);
    this.name = "FailedToFetchError";
  }
}
