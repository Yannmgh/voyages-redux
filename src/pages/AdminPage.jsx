import { useEffect } from "react"
import { Alert, Badge, Card, Spinner, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { fetchContactMessages } from "../features/contact/contactSlice"

function AdminPage() {
    const dispatch = useDispatch()
    const { messages, messagesStatus, messagesError } = useSelector((state) => state.contact)

    useEffect(() => {
        dispatch(fetchContactMessages())
    }, [dispatch])

    return (
        <Card className="mx-auto w-100 shadow-sm border-0" style={{ maxWidth: "960px" }}>
            <Card.Body className="p-4 p-md-5">
                <div className="d-flex align-items-center gap-2 mb-4">
                    <h1 className="font-display fw-bold mb-0">Administration</h1>
                    <Badge bg="dark">Réservé aux admins</Badge>
                </div>

                <h2 className="h5 fw-bold mb-3">Demandes de contact</h2>

                {messagesStatus === "loading" && (
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Spinner animation="border" size="sm" />
                        <span>Chargement des demandes...</span>
                    </div>
                )}

                {messagesStatus === "failed" && <Alert variant="danger">{messagesError}</Alert>}

                {messagesStatus === "succeeded" && messages.length === 0 && (
                    <Alert variant="info">Aucune demande de contact pour le moment.</Alert>
                )}

                {messagesStatus === "succeeded" && messages.length > 0 && (
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
                                {messages.map((item, index) => (
                                    <tr key={item.id ?? index}>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.subject}</td>
                                        <td>{item.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default AdminPage
