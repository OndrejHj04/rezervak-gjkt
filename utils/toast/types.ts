export type Toast = { id: string, message: string, type: "success" | "error" }
import messages from "./messages.json"

type PathsToStringProps<T> = T extends { success: string; error: string }
  ? []
  : {
    [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]
  }[Extract<keyof T, string>]

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
  ? `${F}${D}${Join<Extract<R, string[]>, D>}`
  : never
  : string

export type MessagePaths = Join<PathsToStringProps<typeof messages>, '.'>
