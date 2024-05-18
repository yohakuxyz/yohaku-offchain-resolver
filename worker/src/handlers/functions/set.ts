import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { Name } from '../../models'
import { stringifyNameForDb } from './utils'

export async function set(nameData: Name, env: Env) {
  const db = createKysely(env)
  const body = stringifyNameForDb(nameData)

  await db
    .insertInto('names')
    .values(body)
    .onConflict((oc) => oc.column('name').doUpdateSet(body))
    .execute()
}

export async function approve(name: string, env: Env): Promise<boolean> {
  const db = createKysely(env)

  await db
    .updateTable('names')
    .set({ status: 'approved' })
    .where('name', '=', name)
    .execute()

  return true
}
export async function reject(owner: string, env: Env): Promise<boolean> {
  const db = createKysely(env)

  await db
    .updateTable('names')
    .set({ status: 'rejected', name: '' })
    .where('owner', '=', owner)
    .execute()

  return true
}
