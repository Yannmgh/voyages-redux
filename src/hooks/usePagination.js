import { useMemo, useState } from "react"

export function usePagination(items, pageSize = 10) {
    const [page, setPage] = useState(1)
    const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
    const safePage = Math.min(page, pageCount)

    const pageItems = useMemo(() => {
        const start = (safePage - 1) * pageSize
        return items.slice(start, start + pageSize)
    }, [items, safePage, pageSize])

    return { page: safePage, setPage, pageCount, pageItems }
}
