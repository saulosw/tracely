import { builder } from '../builder.js'

import type { User } from '../../../domain/index.js'


const UserType = builder.objectRef<User>('User').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    firstName: t.exposeString('firstName'),
    email: t.exposeString('email'),
  }),
})

type AuthPayload = { user: User }

const AuthPayloadType = builder.objectRef<AuthPayload>('AuthPayload').implement({
  fields: (t) => ({
    user: t.field({ type: UserType, resolve: (payload) => payload.user }),
  }),
})

const RegisterInput = builder.inputType('RegisterInput', {
  fields: (t) => ({
    firstName: t.string({ required: true }),
    email: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
})

const LoginInput = builder.inputType('LoginInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
})

builder.queryField('me', (t) =>
  t.field({
    type: UserType,
    nullable: true,
    resolve: (_root, _args, context) => context.currentUser,
  }),
)

builder.mutationField('register', (t) =>
  t.field({
    type: AuthPayloadType,
    args: { input: t.arg({ type: RegisterInput, required: true }) },
    resolve: async (_root, args, context) => {
      const result = await context.useCases.registerUser(args.input)
      context.setSessionCookie(result.sessionToken, result.sessionExpiresAt)
      return { user: result.user }
    },
  }),
)

builder.mutationField('login', (t) =>
  t.field({
    type: AuthPayloadType,
    args: { input: t.arg({ type: LoginInput, required: true }) },
    resolve: async (_root, args, context) => {
      const result = await context.useCases.loginUser(args.input)
      context.setSessionCookie(result.sessionToken, result.sessionExpiresAt)
      return { user: result.user }
    },
  }),
)

builder.mutationField('logout', (t) =>
  t.field({
    type: 'Boolean',
    resolve: async (_root, _args, context) => {
      if (context.sessionToken) {
        await context.useCases.logoutUser(context.sessionToken)
      }
      context.clearSessionCookie()
      return true
    },
  }),
)
