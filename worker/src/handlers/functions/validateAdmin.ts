import { createKysely } from '../../db/kysely'
import { Env } from '../../env'

export async function validateAdmin(
  address: string,
  env: Env
): Promise<boolean> {
  const db = createKysely(env)
  const record = await db
    .selectFrom('admins')
    .selectAll()
    .where('address', '=', address)
    .executeTakeFirst()

  if (record) {
    return true
  } else {
    return false
  }
}

export async function getAdmin(env: Env) {
  const db = createKysely(env)
  const record = await db.selectFrom('admins').selectAll().execute()

  return record
}
