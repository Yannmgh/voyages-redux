import { useEffect } from "react"
import { Alert, Card, Form, Spinner, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { FiSearch } from "react-icons/fi"
import { fetchContactMessages } from "../../features/contact/contactSlice"
import { useTableSearch } from "../../hooks/useTableSearch"
import { usePagination } from "../../hooks/usePagination"
import TablePagination from "../../components/TablePagination"

function AdminContactsPage() {
    const dispatch = useDispatch()
    const { messages, messagesStatus, messagesError } = useSelector((state) => state.contact)

    useEffect(() => {
        dispatch(fetchContactMessages())
    }, [dispatch])

    const { search, setSearch, filtered } = useTableSearch(
        messages,
        (item) => `${item.name} ${item.email} ${item.subject} ${item.message}`
    )
    const { page, setPage, pageCount, pageItems } = usePagination(filtered, 10)

    return (
        <>
            <div className="mb-4">
                <h1 className="font-display fw-bold mb-1">Messages de contact</h1>
                <p className="text-muted mb-0">{messages.length} message{messages.length > 1 ? "s" : ""} reçu{messages.length > 1 ? "s" : ""}</p>
            </div>

            {messagesStatus === "failed" && <Alert variant="danger">{messagesError}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                    {messagesStatus === "loading" && (
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Spinner animation="border" size="sm" />
                            <span>Chargement des demandes...</span>
                        </div>
                    )}

                    {messagesStatus === "succeeded" && messages.length === 0 && (
                        <Alert variant="info" className="mb-0">Aucune demande de contact pour le moment.</Alert>
                    )}

                    {messagesStatus === "succeeded" && messages.length > 0 && (
                        <>
                            <div className="search-field mb-3">
                                <FiSearch className="search-field-icon" />
                                <Form.Control
                                    type="search"
                                    placeholder="Rechercher par nom, email ou sujet..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>
                            <div className="table-responsive">
                                <Table striped hover size="sm" className="align-middle">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Email</th>
                                            <th>Sujet</th>
                                            <th>Message</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageItems.map((item, index) => (
                                            <tr key={item.id ?? index}>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.subject}</td>
                                                <td>{item.message}</td>
                                            </tr>
                                        ))}
                                        {pageItems.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-4">
                                                    Aucun message ne correspond à la recherche.
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
        </>
    )
}

export default AdminContactsPage
