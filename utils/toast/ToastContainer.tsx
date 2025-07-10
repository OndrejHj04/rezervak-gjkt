import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function ToastContainer() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState([{ msg: 'test1', type: 'success' }, { msg: 'test2', type: 'error' }])

  useEffect(() => setMounted(true), [])

  const styleClass = (type) => {
    const background = type === "error" ? "bg-red-600" : "bg-green-600"

    return `text-white px-4 py-3 text-sm rounded-md shadow-lg ${background} transition-all duration-300 shadow-xl`
  }

  return mounted ? createPortal(
    <div className="fixed flex flex-col gap-3 bottom-8 left-8 font-semibold z-50">
      {
        messages.map((msg, i) => (
          <div className={styleClass(msg.type)} key={i}>{msg.msg}</div>))
      }
    </div>
    , document.body) : null
} 
