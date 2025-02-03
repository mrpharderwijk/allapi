import { AppError } from "../../helpers/errors.helper";

export const USER_ERRORS = {
  invalidToken: new AppError('Token is invalid.', 401),
  userExists: new AppError('User already exists', 409),
  userNotExists: new AppError('User not exists', 404),
  userCredError: new AppError('Invalid credential', 401),
  tokenError: new AppError('Invalid Token', 401),
};