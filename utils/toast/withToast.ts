import messages from "./messages.json"
import ToastManager from "./ToastManager";

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

export const withToast = async (func: Promise<{ success: boolean }>, { message, onSuccess, onError }: { message: MessagePaths, onSuccess?: () => void, onError?: () => void }) => {
  const { success: successfulyResolved } = await func
  const keys = message.split('.')
  let messageConfig: any = messages

  for (const key of keys) {
    messageConfig = messageConfig[key]
  }

  if (successfulyResolved) {
    if (onSuccess) onSuccess()
    ToastManager.show(messageConfig.success, 'success')
  }
  else {
    if (onError) onError()
    ToastManager.show(messageConfig.success, 'error')
  }

  return successfulyResolved
}
