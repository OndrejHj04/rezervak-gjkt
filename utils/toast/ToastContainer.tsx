import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import ToastManager from "./ToastManager"
import { Toast } from "./types"

export default function ToastContainer() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Toast[]>([])

  useEffect(() => {
    setMounted(true)
    ToastManager.register(setMessages)
  }, [])

  const styleClass = (type: Toast["type"]) => {
    const background = type === "error" ? "bg-red-600" : "bg-green-600"

    return `text-white px-4 py-3 text-sm rounded-md shadow-lg ${background} transition-all duration-300 shadow-xl`
  }

  return mounted ? createPortal(
    <div className="fixed flex flex-col gap-3 bottom-8 left-8 font-semibold z-50">
      {
        messages.map((msg, i) => (
          <div className={styleClass(msg.type)} key={i}>{msg.message}</div>))
      }
    </div>
    , document.body) : null
} 
