import { toast } from "react-toastify"
import messages from "./messages.json"

type Messages = typeof messages

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

type MessagePaths = Join<PathsToStringProps<Messages>, '.'>

export const withToast = async (func: Promise<{ success: boolean }>, path: MessagePaths) => {
  const { success: successfulyResolved } = await func
  const keys = path.split('.')
  let messageConfig: any = messages

  for (const key of keys) {
    messageConfig = messageConfig[key]
  }

  if (successfulyResolved) toast.success(messageConfig.success)
  else toast.error(messageConfig.error)
}
