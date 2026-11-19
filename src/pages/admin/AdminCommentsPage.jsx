import { useEffect } from "react"
import { Alert, Badge, Button, Card, Form, Spinner, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { FiSearch, FiTrash2 } from "react-icons/fi"
import { deleteComment, fetchAllComments } from "../../features/comments/commentsSlice"
import { fetchDestinations } from "../../features/destinations/destinationsSlice"
import { useTableSearch } from "../../hooks/useTableSearch"
import { usePagination } from "../../hooks/usePagination"
import { useConfirm } from "../../hooks/useConfirm"
import { useToast } from "../../hooks/useToast"
import TablePagination from "../../components/TablePagination"

function AdminCommentsPage() {
    const dispatch = useDispatch()
    const showToast = useToast()
    const { confirm, confirmModal } = useConfirm()
    const { all: comments, allStatus, allError } = useSelector((state) => state.comments)
    const { items: destinations, status: destinationsStatus } = useSelector((state) => state.destinations)

    useEffect(() => {
        if (destinationsStatus === "idle") {
            dispatch(fetchDestinations())
        }
    }, [dispatch, destinationsStatus])

    useEffect(() => {
        if (destinationsStatus === "succeeded") {
            dispatch(fetchAllComments(destinations))
        }
        // destinations change de référence à chaque fetch, mais seul destinationsStatus
        // doit déclencher ce chargement (voir DestinationsPage pour le même écueil).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, destinationsStatus])

    const { search, setSearch, filtered } = useTableSearch(
        comments,
        (item) => `${item.destination_name} ${item.content}`
    )
    const { page, setPage, pageCount, pageItems } = usePagination(filtered, 10)

    const handleDelete = async (comment) => {
        const ok = await confirm({
            title: "Supprimer ce commentaire ?",
            body: "Cette action est irréversible.",
        })
        if (ok) {
            await dispatch(deleteComment(comment.id))
            showToast("Commentaire supprimé.")
        }
    }

    return (
        <>
            <div className="mb-4">
                <h1 className="font-display fw-bold mb-1">Commentaires</h1>
                <p className="text-muted mb-0">{comments.length} commentaire{comments.length > 1 ? "s" : ""} au total</p>
            </div>

            {allStatus === "failed" && <Alert variant="danger">{allError}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                    {(allStatus === "loading" || destinationsStatus === "loading") && (
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Spinner animation="border" size="sm" />
                            <span>Chargement des commentaires...</span>
                        </div>
                    )}

                    {allStatus === "succeeded" && comments.length === 0 && (
                        <Alert variant="info" className="mb-0">Aucun commentaire pour le moment.</Alert>
                    )}

                    {allStatus === "succeeded" && comments.length > 0 && (
                        <>
                            <div className="search-field mb-3">
                                <FiSearch className="search-field-icon" />
                                <Form.Control
                                    type="search"
                                    placeholder="Rechercher par destination ou contenu..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>
                            <div className="table-responsive">
                                <Table striped hover size="sm" className="align-middle">
                                    <thead>
                                        <tr>
                                            <th>Destination</th>
                                            <th>Commentaire</th>
                                            <th>Note</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageItems.map((comment) => (
                                            <tr key={comment.id}>
                                                <td>{comment.destination_name}</td>
                                                <td>{comment.content}</td>
                                                <td>{comment.rating ? <Badge bg="warning" text="dark">{comment.rating} / 5</Badge> : "—"}</td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => handleDelete(comment)}
                                                        aria-label="Supprimer ce commentaire"
                                                        title="Supprimer"
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {pageItems.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-4">
                                                    Aucun commentaire ne correspond à la recherche.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                            <TablePagination page={page} pageCount={pageCount} onChange={setPage} />
                        </>
                    )}
                </Card.Body>
            </Card>

            {confirmModal}
        </>
    )
}

export default AdminCommentsPage
