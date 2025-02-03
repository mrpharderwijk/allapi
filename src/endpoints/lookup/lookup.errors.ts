import { AppError } from "../../helpers/errors.helper";

export const LOOKUP_ERRORS = {
  addressNotFound: new AppError('Address not found', 404),
};