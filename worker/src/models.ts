import { ColumnType, Generated } from 'kysely'
import z from 'zod'

export const ZodAdmin = z.object({
  id: z.number().optional(),
  address: z.string(),
})

export const ZodName = z.object({
  id: z.number().optional(),
  name: z.string().regex(/^[a-z0-9-.]+$/),
  owner: z.string(),
  addresses: z.record(z.string()).optional(),
  texts: z.record(z.string()).optional(),
  contenthash: z.string().optional(),
  rejected: z.string().optional(),
})

export const ZodNameWithSignature = ZodName.extend({
  signature: z.object({
    hash: z.string(),
    message: z.string(),
  }),
})

export type Name = z.infer<typeof ZodName>
export type NameWithSignature = z.infer<typeof ZodNameWithSignature>

export interface NameInKysely {
  id: Generated<number>
  name: string
  owner: string
  addresses: string | null // D1 doesn't support JSON yet, we'll have to parse it manually
  texts: string | null // D1 doesn't support JSON yet, we'll have to parse it manually
  contenthash: string | null
  rejected: string | undefined
  createdAt: ColumnType<Date, never, never>
  updatedAt: ColumnType<Date, never, string | undefined>
}

export type Admin = z.infer<typeof ZodAdmin>

export interface AdminInKysely {
  id: Generated<number>
  address: string
  createdAt: ColumnType<Date, never, never>
  updatedAt: ColumnType<Date, never, string | undefined>
}
