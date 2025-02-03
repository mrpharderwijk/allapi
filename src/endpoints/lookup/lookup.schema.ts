import Joi from 'joi';

export interface ILookupDto {
  postalCode: string;
  houseNumber: string;
  additionalInfo?: string;
}

export const lookupSchema = Joi.object({
  postalCode: Joi.string().pattern(/^\d{4}\s?[A-Za-z]{2}$/).required(),
  houseNumber: Joi.string().min(1).required(),
  additionalInfo: Joi.string().optional(),
});