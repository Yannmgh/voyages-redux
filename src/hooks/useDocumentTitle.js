import { useEffect } from "react"

export function useDocumentTitle(title) {
    useEffect(() => {
        const previous = document.title
        document.title = title ? `${title} — Voyages` : "Voyages — Carnet de voyage"
        return () => {
            document.title = previous
        }
    }, [title])
}
