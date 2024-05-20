import { verifyMessage } from 'ethers/lib/utils'
import { IRequest } from 'itty-router'

import { Env } from '../env'
import { ZodNameWithSignature } from '../models'
import { get } from './functions/get'
import { approve, reject, set } from './functions/set'

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
    const signer = verifyMessage(signature.message, signature.hash)
    if (signer.toLowerCase() !== owner.toLowerCase()) {
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

const admin = '0x06aa005386F53Ba7b980c61e0D067CaBc7602a62'

export async function approveName(request: IRequest, env: Env) {
  const body = await request.json()
  const safeParse = ZodNameWithSignature.safeParse(body)

  if (!safeParse.success) {
    const response = { success: false, error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { name, owner, signature, status } = safeParse.data

  // Only allow 3LDs, no nested subdomains
  if (name.split('.').length !== 3) {
    const response = { success: false, error: 'Invalid name' }
    return Response.json(response, { status: 400 })
  }

  // Check if the status is valid
  if (status !== 'approved') {
    const response = { success: false, error: 'Invalid status' }
    return Response.json(response, { status: 400 })
  }

  // Validate signature
  try {
    const signer = verifyMessage(signature.message, signature.hash)
    if (signer.toLowerCase() !== admin.toLowerCase()) {
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
    const response = { success: false, error: 'Name already taken' }
    return Response.json(response, { status: 409 })
  }

  // Save the name and approve it
  try {
    await approve(safeParse.data, env)
    const response = { success: true }
    return Response.json(response, { status: 201 })
  } catch (err) {
    console.error(err)
    const response = { success: false, error: 'Error approving status' }
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
    const signer = verifyMessage(signature.message, signature.hash)
    if (signer.toLowerCase() !== admin.toLowerCase()) {
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
    const response = { success: false, error: 'Name already taken' }
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
