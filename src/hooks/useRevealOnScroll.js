import { useEffect, useRef, useState } from "react"

export function useRevealOnScroll() {
    const ref = useRef(null)
    const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined")

    useEffect(() => {
        if (visible) return undefined
        const node = ref.current
        if (!node) return undefined

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.15 }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [visible])

    return [ref, visible]
}
