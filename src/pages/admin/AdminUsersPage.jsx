import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Alert, Badge, Button, Card, Form, Modal, OverlayTrigger, Spinner, Table, Tooltip } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import * as yup from "yup"
import { FiKey, FiSearch } from "react-icons/fi"
import { changeUserPassword, clearPasswordStatus, fetchUsers } from "../../features/users/usersSlice"
import { passwordField } from "../../utils/validation"
import { useTableSearch } from "../../hooks/useTableSearch"
import { usePagination } from "../../hooks/usePagination"
import { useToast } from "../../hooks/useToast"
import TablePagination from "../../components/TablePagination"

const passwordSchema = yup.object({
    newPassword: passwordField,
    confirmPassword: yup
        .string()
        .required("La confirmation est obligatoire")
        .oneOf([yup.ref("newPassword")], "Les mots de passe ne correspondent pas"),
})

function ChangeUserPasswordModal({ user, onHide }) {
    const dispatch = useDispatch()
    const showToast = useToast()
    const { passwordStatus, passwordError } = useSelector((state) => state.users)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(passwordSchema),
        defaultValues: { newPassword: "", confirmPassword: "" },
    })

    const onSubmit = async (data) => {
        try {
            await dispatch(changeUserPassword({ user_id: user.id, ...data })).unwrap()
            reset()
            showToast(`Mot de passe de ${user.username} modifié.`)
            onHide()
        } catch {
            // l'erreur est déjà exposée via le state Redux (passwordError)
        }
    }

    return (
        <Modal
            show={!!user}
            onHide={() => {
                reset()
                dispatch(clearPasswordStatus())
                onHide()
            }}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Changer le mot de passe de {user?.username}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    {passwordStatus === "failed" && <Alert variant="danger">{passwordError}</Alert>}

                    <Form.Group controlId="admin-new-password" className="mb-3">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control type="password" isInvalid={!!errors.newPassword} {...register("newPassword")} />
                        <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="admin-confirm-password" className="mb-1">
                        <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                        <Form.Control type="password" isInvalid={!!errors.confirmPassword} {...register("confirmPassword")} />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        Annuler
                    </Button>
                    <Button type="submit" className="btn-gradient" disabled={passwordStatus === "loading"}>
                        {passwordStatus === "loading" ? "Enregistrement..." : "Changer le mot de passe"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

function AdminUsersPage() {
    const dispatch = useDispatch()
    const { list: users, listStatus, listError } = useSelector((state) => state.users)
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    const { search, setSearch, filtered } = useTableSearch(
        users,
        (item) => `${item.username} ${item.email} ${item.first_name ?? ""} ${item.last_name ?? ""}`
    )
    const { page, setPage, pageCount, pageItems } = usePagination(filtered, 10)

    return (
        <>
            <div className="mb-4">
                <h1 className="font-display fw-bold mb-1">Utilisateurs</h1>
                <p className="text-muted mb-0">{users.length} compte{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}</p>
            </div>

            {listStatus === "failed" && <Alert variant="danger">{listError}</Alert>}

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                    {listStatus === "loading" && (
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Spinner animation="border" size="sm" />
                            <span>Chargement des utilisateurs...</span>
                        </div>
                    )}

                    {listStatus === "succeeded" && (
                        <>
                            <div className="search-field mb-3">
                                <FiSearch className="search-field-icon" />
                                <Form.Control
                                    type="search"
                                    placeholder="Rechercher par username, email ou nom..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>
                            <div className="table-responsive">
                                <Table striped hover size="sm" className="align-middle">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Nom complet</th>
                                            <th>Rôle</th>
                                            <th>Créé le</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.username}</td>
                                                <td>{item.email}</td>
                                                <td>{item.first_name} {item.last_name}</td>
                                                <td>
                                                    <Badge bg={item.role === "admin" ? "dark" : "secondary"}>{item.role}</Badge>
                                                </td>
                                                <td>{item.created_at}</td>
                                                <td>
                                                    <OverlayTrigger overlay={<Tooltip>Changer le mot de passe</Tooltip>}>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => setSelectedUser(item)}
                                                            aria-label={`Changer le mot de passe de ${item.username}`}
                                                        >
                                                            <FiKey />
                                                        </Button>
                                                    </OverlayTrigger>
                                                </td>
                                            </tr>
                                        ))}
                                        {pageItems.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center text-muted py-4">
                                                    Aucun utilisateur ne correspond à la recherche.
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

            <ChangeUserPasswordModal user={selectedUser} onHide={() => setSelectedUser(null)} />
        </>
    )
}

export default AdminUsersPage
