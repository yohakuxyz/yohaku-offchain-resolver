import { verifyMessage as ethersVerifyMessage } from 'ethers/lib/utils'
import { IRequest } from 'itty-router'
import { verifyMessage } from 'viem'
import { Env } from '../env'
import { ZodNameWithSignature } from '../models'
import { get } from './functions/get'
import { reject, set } from './functions/set'
import { validateAdmin } from './functions/validateAdmin'

export async function setName(request: IRequest, env: Env): Promise<Response> {
  const body = await request.json()
  const safeParse = ZodNameWithSignature.safeParse(body)

  if (!safeParse.success) {
    const response = { success: false, error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { name, owner, signature } = safeParse.data

  // Only allow 3LDs, no nested subdomains
  if (name.split('.').length !== 3) {
    const response = { success: false, error: 'Invalid name' }
    return Response.json(response, { status: 400 })
  }

  // Validate signature
  try {
    // const signer = verifyMessage(signature.message, signature.hash)
    const result = verifyMessage({
      address: owner as `0x${string}`,
      message: signature.message,
      signature: signature.hash as `0x${string}`,
    })

    if (!result) {
      throw new Error('Invalid signer')
    }
  } catch (err) {
    console.error(err)
    const response = { success: false, error: err }
    return Response.json(response, { status: 401 })
  }

  // Check if the name is already taken
  const existingName = await get(name, env)

  // If the name is owned by someone else, return an error
  if (existingName && existingName.owner !== owner) {
    const response = { success: false, error: 'Name already taken' }
    return Response.json(response, { status: 409 })
  }

  // Save the name
  try {
    await set(safeParse.data, env)
    const response = { success: true }
    return Response.json(response, { status: 201 })
  } catch (err) {
    console.error(err)
    const response = { success: false, error: 'Error setting name' }
    return Response.json(response, { status: 500 })
  }
}

export async function rejectName(request: IRequest, env: Env) {
  const body = await request.json()
  const safeParse = ZodNameWithSignature.safeParse(body)

  if (!safeParse.success) {
    const response = { success: false, error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { name, owner, signature } = safeParse.data

  // Validate signature
  try {
    const signer = ethersVerifyMessage(signature.message, signature.hash)
    if (!validateAdmin(signer.toLowerCase(), env)) {
      throw new Error('Invalid signer')
    }
  } catch (err) {
    console.error(err)
    const response = { success: false, error: err }
    return Response.json(response, { status: 401 })
  }

  // Check if the name is already taken
  const existingName = await get(name, env)

  // If the name is owned by someone else, return an error
  if (!existingName || existingName.owner !== owner) {
    const response = {
      success: false,
      error: 'owner is wrong owner or not existing',
    }
    return Response.json(response, { status: 409 })
  }

  // Reject the name
  try {
    await reject(safeParse.data, env)
    const response = { success: true }
    return Response.json(response, { status: 201 })
  } catch (err) {
    console.error(err)
    const response = { success: false, error: 'Error rejecting name' }
    return Response.json(response, { status: 500 })
  }
}
