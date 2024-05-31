import { CamelCasePlugin, Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

import { Env } from '../env'
import { AdminInKysely, NameInKysely } from '../models'

export interface Database {
  names: NameInKysely
  admins: AdminInKysely
}

export function createKysely(env: Env): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new D1Dialect({ database: env.DB }),
    plugins: [new CamelCasePlugin()],
  })
}
