import { useCallback, useRef, useState } from "react"
import ConfirmModal from "../components/ConfirmModal"

export function useConfirm() {
    const [state, setState] = useState(null)
    const resolver = useRef(null)

    const confirm = useCallback((options) => {
        setState(options)
        return new Promise((resolve) => {
            resolver.current = resolve
        })
    }, [])

    const handleConfirm = () => {
        resolver.current?.(true)
        setState(null)
    }

    const handleCancel = () => {
        resolver.current?.(false)
        setState(null)
    }

    const confirmModal = (
        <ConfirmModal
            show={!!state}
            title={state?.title ?? "Confirmer"}
            body={state?.body ?? ""}
            confirmLabel={state?.confirmLabel}
            variant={state?.variant}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    )

    return { confirm, confirmModal }
}
