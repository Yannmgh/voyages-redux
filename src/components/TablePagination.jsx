import { Button } from "react-bootstrap"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

function TablePagination({ page, pageCount, onChange }) {
    if (pageCount <= 1) return null

    return (
        <div className="d-flex align-items-center justify-content-between mt-3">
            <span className="text-muted small">
                Page {page} / {pageCount}
            </span>
            <div className="d-flex gap-2">
                <Button
                    size="sm"
                    variant="outline-secondary"
                    disabled={page <= 1}
                    onClick={() => onChange(page - 1)}
                    aria-label="Page précédente"
                >
                    <FiChevronLeft />
                </Button>
                <Button
                    size="sm"
                    variant="outline-secondary"
                    disabled={page >= pageCount}
                    onClick={() => onChange(page + 1)}
                    aria-label="Page suivante"
                >
                    <FiChevronRight />
                </Button>
            </div>
        </div>
    )
}

export default TablePagination
