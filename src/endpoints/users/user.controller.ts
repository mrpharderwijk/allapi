import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils';
import { handleServerError } from '../../helpers/errors.helper';
import * as JWT from 'jsonwebtoken';
import { utils } from '../../utils';
import { STANDARD } from '../../constants/request';
import { IUserLoginDto, IUserSignupDto } from './user.schema';
import { USER_ERRORS } from './user.errors';

export const login = async (
  request: FastifyRequest<{
    Body: IUserLoginDto;
  }>,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply
        .code(USER_ERRORS.userNotExists.statusCode)
        .send(USER_ERRORS.userNotExists.message);
    }

    const checkPass = await utils.compareHash(user.password, password);
    if (!checkPass) {
      return reply
        .code(USER_ERRORS.userCredError.statusCode)
        .send(USER_ERRORS.userCredError.message);
    }

    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
        apiKey: user.apiKey,
      },
      process.env.APP_JWT_SECRET as string,
    );

    const { password: _, ...userWithoutPassword } = user;
    return reply.code(STANDARD.OK.statusCode).send({
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    return handleServerError(reply, err);
  }
};

export const signUp = async (
  request: FastifyRequest<{
    Body: IUserSignupDto;
  }>,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      console.log('----------------------------------------->>>>>> User already exists');
      return reply.code(USER_ERRORS.userExists.statusCode).send(USER_ERRORS.userExists);
    }
    
    const hashPass = await utils.genSalt(10, password);
    const createUser = await prisma.user.create({
      data: {
        email,
        password: String(hashPass),
      },
    });

    const token = JWT.sign(
      {
        id: createUser.id,
        email: createUser.email,
        apiKey: createUser.apiKey,
      },
      process.env.APP_JWT_SECRET as string,
    );

    const { password: _, ...userWithoutPassword } = createUser;
    return reply.code(STANDARD.OK.statusCode).send({
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return handleServerError(reply, err);
  }
};
