import { Dispatch, SetStateAction } from "react"
import { MessagePaths, Toast } from "./types"
import messages from "./messages.json"

class ToastManager {
  private setMessages: Dispatch<SetStateAction<Toast[]>> | null = null

  register(setMessages: Dispatch<SetStateAction<Toast[]>>) {
    this.setMessages = setMessages
  }

  show(message: `${MessagePaths}.success` | `${MessagePaths}.error`) {
    if (!this.setMessages) return

    const keys = message.split('.')
    const type = keys[keys.length - 1] as "success" | "error"

    let messageConfig: any = messages

    for (const key of keys) {
      messageConfig = messageConfig[key]
    }

    const id = Date.now().toString()
    const toast: Toast = { id, message: messageConfig, type }

    this.setMessages(prev => [...prev, toast])

    setTimeout(() => {
      this.hide(toast)
    }, 4000)
  }

  hide(toast: Toast) {
    if (!this.setMessages) return
    this.setMessages(prev => prev.filter(({ id }) => id !== toast.id))
  }
}

export default new ToastManager()
