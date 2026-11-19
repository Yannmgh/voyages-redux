import { useMemo, useState } from "react"

export function useTableSearch(items, getHaystack) {
    const [search, setSearch] = useState("")
    const normalized = search.trim().toLowerCase()

    const filtered = useMemo(() => {
        if (!normalized) return items
        return items.filter((item) => getHaystack(item).toLowerCase().includes(normalized))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, normalized])

    return { search, setSearch, filtered }
}
