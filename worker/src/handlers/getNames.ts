import { createKysely } from '../db/kysely'
import { Env } from '../env'
import { parseNameFromDb } from './functions/utils'

export async function getNames(env: Env) {
  const db = createKysely(env)
  const names = await db.selectFrom('names').selectAll().execute()
  const parsedNames = parseNameFromDb(names)

  // Simplify the response format
  const formattedNames = parsedNames.reduce((acc, name) => {
    return {
      ...acc,
      [name.name]: {
        id: name.id,
        addresses: name.addresses,
        texts: name.texts,
        contenthash: name.contenthash,
        owner: name.owner,
        rejected: name.rejected,
      },
    }
  }, {})

  return Response.json(formattedNames, {
    status: 200,
  })
}
