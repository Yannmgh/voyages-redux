import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Alert, Button, Card, Col, Form, Modal, Row, Spinner, Table } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import * as yup from "yup"
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi"
import {
    clearActionStatus,
    createDestination,
    deleteDestination,
    fetchDestinations,
    fetchRegions,
} from "../../features/destinations/destinationsSlice"
import { useTableSearch } from "../../hooks/useTableSearch"
import { usePagination } from "../../hooks/usePagination"
import { useConfirm } from "../../hooks/useConfirm"
import { useToast } from "../../hooks/useToast"
import TablePagination from "../../components/TablePagination"

const destinationSchema = yup.object({
    slug: yup.string().required("Le slug est obligatoire"),
    name: yup.string().required("Le nom est obligatoire"),
    region_id: yup.number().typeError("La région est obligatoire").required("La région est obligatoire"),
    capital: yup.string().required("La capitale est obligatoire"),
    description: yup.string().required("La description est obligatoire"),
    image: yup.string().required("L'image est obligatoire").url("L'URL de l'image est invalide"),
    lat: yup.string().required("La latitude est obligatoire"),
    long: yup.string().required("La longitude est obligatoire"),
})

function CreateDestinationModal({ show, onHide, regions }) {
    const dispatch = useDispatch()
    const showToast = useToast()
    const { actionStatus, actionError } = useSelector((state) => state.destinations)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(destinationSchema),
        defaultValues: { slug: "", name: "", region_id: "", capital: "", description: "", image: "", lat: "", long: "" },
    })

    const onSubmit = async (data) => {
        try {
            await dispatch(createDestination(data)).unwrap()
            reset()
            dispatch(fetchDestinations())
            showToast(`Destination "${data.name}" créée.`)
            onHide()
        } catch {
            // l'erreur est déjà exposée via le state Redux (actionError)
        }
    }

    return (
        <Modal
            show={show}
            onHide={() => {
                reset()
                dispatch(clearActionStatus())
                onHide()
            }}
            centered
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Nouvelle destination</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    {actionStatus === "failed" && <Alert variant="danger">{actionError}</Alert>}

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="dest-name" className="mb-3">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control type="text" isInvalid={!!errors.name} {...register("name")} />
                                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="dest-slug" className="mb-3">
                                <Form.Label>Slug</Form.Label>
                                <Form.Control type="text" isInvalid={!!errors.slug} {...register("slug")} />
                                <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="dest-region" className="mb-3">
                                <Form.Label>Région</Form.Label>
                                <Form.Select isInvalid={!!errors.region_id} {...register("region_id")}>
                                    <option value="">Choisir une région</option>
                                    {regions.map((region) => (
                                        <option key={region.id} value={region.id}>{region.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.region_id?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="dest-capital" className="mb-3">
                                <Form.Label>Capitale</Form.Label>
                                <Form.Control type="text" isInvalid={!!errors.capital} {...register("capital")} />
                                <Form.Control.Feedback type="invalid">{errors.capital?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group controlId="dest-description" className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} isInvalid={!!errors.description} {...register("description")} />
                        <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="dest-image" className="mb-3">
                        <Form.Label>Image (URL)</Form.Label>
                        <Form.Control type="text" isInvalid={!!errors.image} {...register("image")} />
                        <Form.Control.Feedback type="invalid">{errors.image?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="dest-lat" className="mb-1">
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control type="text" isInvalid={!!errors.lat} {...register("lat")} />
                                <Form.Control.Feedback type="invalid">{errors.lat?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="dest-long" className="mb-1">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control type="text" isInvalid={!!errors.long} {...register("long")} />
                                <Form.Control.Feedback type="invalid">{errors.long?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        Annuler
                    </Button>
                    <Button type="submit" className="btn-gradient" disabled={actionStatus === "loading"}>
                        {actionStatus === "loading" ? "Création..." : "Créer la destination"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

function AdminDestinationsPage() {
    const dispatch = useDispatch()
    const showToast = useToast()
    const { confirm, confirmModal } = useConfirm()
    const user = useSelector((state) => state.auth.user)
    const { items: destinations, status, regions, actionStatus, actionError } = useSelector(
        (state) => state.destinations
    )
    const [showCreate, setShowCreate] = useState(false)

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchDestinations())
        }
        dispatch(fetchRegions())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const { search, setSearch, filtered } = useTableSearch(
        destinations,
        (item) => `${item.name} ${item.region_name} ${item.capital} ${item.creator_username}`
    )
    const { page, setPage, pageCount, pageItems } = usePagination(filtered, 10)

    const handleDelete = async (item) => {
        const ok = await confirm({
            title: "Supprimer cette destination ?",
            body: `"${item.name}" sera définitivement supprimée. Cette action est irréversible.`,
        })
        if (ok) {
            await dispatch(deleteDestination(item.id))
            showToast(`Destination "${item.name}" supprimée.`)
        }
    }

    return (
        <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                <div>
                    <h1 className="font-display fw-bold mb-1">Destinations</h1>
                    <p className="text-muted mb-0">{destinations.length} destination{destinations.length > 1 ? "s" : ""} au total</p>
                </div>
                <Button className="btn-gradient" onClick={() => setShowCreate(true)}>
                    <FiPlus className="mb-1 me-1" /> Nouvelle destination
                </Button>
            </div>

            {actionStatus === "failed" && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearActionStatus())}>
                    {actionError}
                </Alert>
            )}

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                    {status === "loading" && (
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Spinner animation="border" size="sm" />
                            <span>Chargement des destinations...</span>
                        </div>
                    )}

                    {status === "succeeded" && (
                        <>
                            <div className="search-field mb-3">
                                <FiSearch className="search-field-icon" />
                                <Form.Control
                                    type="search"
                                    placeholder="Rechercher par nom, région, capitale ou créateur..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>
                            <div className="table-responsive">
                                <Table striped hover size="sm" className="align-middle">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Région</th>
                                            <th>Capitale</th>
                                            <th>Créée par</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td>{item.region_name}</td>
                                                <td>{item.capital}</td>
                                                <td>{item.creator_username}</td>
                                                <td>
                                                    {item.creator_id === user?.id && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={() => handleDelete(item)}
                                                            aria-label={`Supprimer ${item.name}`}
                                                            title="Supprimer"
                                                        >
                                                            <FiTrash2 />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {pageItems.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center text-muted py-4">
                                                    Aucune destination ne correspond à la recherche.
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

            <CreateDestinationModal show={showCreate} onHide={() => setShowCreate(false)} regions={regions} />
            {confirmModal}
        </>
    )
}

export default AdminDestinationsPage
