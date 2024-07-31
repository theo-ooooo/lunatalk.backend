import { asConst, FromSchema } from 'json-schema-to-ts';

export const createUserBodySchema = asConst({
  type: 'object',
  required: ['loginId', 'password', 'email'],
  properties: {
    loginId: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    nickname: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
  },
  additionalProperties: false,
});

export type CreateUserBody = FromSchema<typeof createUserBodySchema>;

export const signInUserBodySchema = asConst({
  type: 'object',
  required: ['loginId', 'password'],
  properties: {
    loginId: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  additionalProperties: false,
});

export type SignInUserBody = FromSchema<typeof signInUserBodySchema>;
