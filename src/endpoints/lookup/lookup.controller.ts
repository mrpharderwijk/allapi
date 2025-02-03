import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils';
import { handleServerError } from '../../helpers/errors.helper';
import { STANDARD } from '../../constants/request';
import { ILookupDto } from './lookup.schema';
import { LOOKUP_ERRORS } from './lookup.errors';

export const lookup = async (
  request: FastifyRequest<{
    Body: ILookupDto;
  }>,
  reply: FastifyReply,
) => {
  try {
    const { postalCode, houseNumber } = request.body;
    const address = await prisma.address.findFirst({ 
      where: { 
        AND: {
          postalCode,
          houseNumber
        }
      } 
    });
    if (!address) {
      return reply
        .code(LOOKUP_ERRORS.addressNotFound.statusCode)
        .send({ message: LOOKUP_ERRORS.addressNotFound.message });
    }

    return reply.code(STANDARD.OK.statusCode).send({
      address,
    });
  } catch (err) {
    return handleServerError(reply, err);
  }
};