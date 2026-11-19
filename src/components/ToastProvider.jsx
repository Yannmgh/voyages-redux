import { useCallback, useState } from "react"
import { Toast, ToastContainer } from "react-bootstrap"
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi"
import { ToastContext } from "../context/ToastContext"

let nextId = 1

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback((message, variant = "success") => {
        const id = nextId++
        setToasts((current) => [...current, { id, message, variant }])
    }, [])

    const dismissToast = (id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1080 }}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        bg={toast.variant === "error" ? "danger" : undefined}
                        onClose={() => dismissToast(toast.id)}
                        delay={3500}
                        autohide
                        className={toast.variant === "error" ? "" : "vy-toast-success"}
                    >
                        <Toast.Body className={`d-flex align-items-center gap-2 ${toast.variant === "error" ? "text-white" : ""}`}>
                            {toast.variant === "error" ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
                            {toast.message}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    )
}
