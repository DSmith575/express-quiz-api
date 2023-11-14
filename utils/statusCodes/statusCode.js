/**
* @description Object containing a list of status codes
* @file statusCodes.js

* @author Deacon Smith
* @created 05/11/2023
* @updated 15/11/2023
*/

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  REQUEST_LIMIT: 429,
  SERVER_ERROR: 500,
};

export default STATUS_CODES;
