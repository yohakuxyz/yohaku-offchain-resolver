import { ethers } from 'ethers'
import type { IRequest } from 'itty-router'
import zod from 'zod'

import { Env } from '../env'
import { approve, reject } from './functions/set'

export async function approveName(request: IRequest, env: Env) {
  const schema = zod.object({
    name: zod.string().regex(/^[a-z0-9-.]+$/),
  })
  const safeParse = schema.safeParse(request.params)

  if (!safeParse.success) {
    const response = { error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { name } = safeParse.data
  const approved = await approve(name, env)

  if (!approved) {
    return new Response('Name not found', { status: 404 })
  }

  return Response.json(
    { success: true },
    {
      status: 200,
    }
  )
}

export async function rejectName(request: IRequest, env: Env) {
  const schema = zod.object({
    address: zod.string().refine((val) => ethers.utils.isAddress(val), {
      message: 'Invalid address',
    }),
  })
  const safeParse = schema.safeParse(request.params)

  if (!safeParse.success) {
    const response = { error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { address } = safeParse.data
  const approved = await reject(address, env)

  if (!approved) {
    return new Response('Name not found', { status: 404 })
  }

  return Response.json(
    { success: true },
    {
      status: 200,
    }
  )
}
