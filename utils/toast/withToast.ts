import messages from "./messages.json"
import ToastManager from "./ToastManager";
import { MessagePaths } from "./types";

export const withToast = async (func: Promise<{ success: boolean }>, { message, onSuccess, onError }: { message: MessagePaths, onSuccess?: () => void, onError?: () => void }) => {
  const { success: successfulyResolved } = await func
  const keys = message.split('.')
  let messageConfig: any = messages

  for (const key of keys) {
    messageConfig = messageConfig[key]
  }

  if (successfulyResolved) {
    if (onSuccess) onSuccess()
    ToastManager.show(`${message}.success`)
  }
  else {
    if (onError) onError()
    ToastManager.show(`${message}.error`)
  }

  return successfulyResolved
}
