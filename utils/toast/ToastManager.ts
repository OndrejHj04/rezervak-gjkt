import { Dispatch, SetStateAction } from "react"
import { Toast } from "./types"

class ToastManager {
  private setMessages: Dispatch<SetStateAction<Toast[]>> | null = null

  register(setMessages: Dispatch<SetStateAction<Toast[]>>) {
    this.setMessages = setMessages
  }

  show(message: Toast["message"], type: Toast["type"]) {
    if (!this.setMessages) return

    const id = Date.now().toString()
    const toast: Toast = { id, message, type }

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
