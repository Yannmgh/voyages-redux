import { useEffect, useMemo } from "react"
import { Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiMapPin, FiMessageSquare, FiUsers, FiMail, FiStar, FiPlus } from "react-icons/fi"
import { fetchDestinations } from "../../features/destinations/destinationsSlice"
import { fetchAllComments } from "../../features/comments/commentsSlice"
import { fetchUsers } from "../../features/users/usersSlice"
import { fetchContactMessages } from "../../features/contact/contactSlice"
import StatCard from "../../components/admin/StatCard"
import BarListChart from "../../components/admin/BarListChart"
import { useDocumentTitle } from "../../hooks/useDocumentTitle"

function AdminOverviewPage() {
    useDocumentTitle("Tableau de bord")
    const dispatch = useDispatch()

    const { items: destinations, status: destinationsStatus } = useSelector((state) => state.destinations)
    const { all: comments, allStatus } = useSelector((state) => state.comments)
    const { list: users, listStatus } = useSelector((state) => state.users)
    const { messages, messagesStatus } = useSelector((state) => state.contact)

    useEffect(() => {
        if (destinationsStatus === "idle") dispatch(fetchDestinations())
    }, [dispatch, destinationsStatus])

    useEffect(() => {
        if (destinationsStatus === "succeeded" && allStatus === "idle") {
            dispatch(fetchAllComments(destinations))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, destinationsStatus, allStatus])

    useEffect(() => {
        if (listStatus === "idle") dispatch(fetchUsers())
    }, [dispatch, listStatus])

    useEffect(() => {
        if (messagesStatus === "idle") dispatch(fetchContactMessages())
    }, [dispatch, messagesStatus])

    const regionData = useMemo(() => {
        const counts = new Map()
        destinations.forEach((item) => {
            counts.set(item.region_name, (counts.get(item.region_name) ?? 0) + 1)
        })
        return [...counts.entries()]
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
    }, [destinations])

    const ratingData = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        comments.forEach((comment) => {
            if (comment.rating && counts[comment.rating] !== undefined) counts[comment.rating] += 1
        })
        return [5, 4, 3, 2, 1].map((rating) => ({ label: `${rating} étoile${rating > 1 ? "s" : ""}`, value: counts[rating] }))
    }, [comments])

    const averageRating = useMemo(() => {
        const rated = comments.filter((comment) => comment.rating)
        if (rated.length === 0) return null
        return (rated.reduce((sum, comment) => sum + Number(comment.rating), 0) / rated.length).toFixed(1)
    }, [comments])

    const loading =
        destinationsStatus === "loading" || listStatus === "loading" || messagesStatus === "loading" || allStatus === "loading"

    return (
        <>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                <div>
                    <h1 className="font-display fw-bold mb-1">Tableau de bord</h1>
                    <p className="text-muted mb-0">Vue d'ensemble de l'activité du site</p>
                </div>
                {loading && <Spinner animation="border" size="sm" />}
            </div>

            <Row className="g-3 mb-4">
                <Col sm={6} xl={3}>
                    <StatCard icon={<FiMapPin size={22} />} label="Destinations" value={destinations.length} accent="teal" />
                </Col>
                <Col sm={6} xl={3}>
                    <StatCard icon={<FiUsers size={22} />} label="Utilisateurs" value={users.length} accent="coral" />
                </Col>
                <Col sm={6} xl={3}>
                    <StatCard
                        icon={<FiMessageSquare size={22} />}
                        label={averageRating ? `Commentaires · ${averageRating}/5 ★` : "Commentaires"}
                        value={comments.length}
                        accent="amber"
                    />
                </Col>
                <Col sm={6} xl={3}>
                    <StatCard icon={<FiMail size={22} />} label="Messages de contact" value={messages.length} accent="navy" />
                </Col>
            </Row>

            <Row className="g-3 mb-4">
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <h2 className="h6 fw-bold mb-3">Destinations par région</h2>
                            <BarListChart data={regionData} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <h2 className="h6 fw-bold mb-3">
                                <FiStar className="mb-1 me-1" /> Répartition des notes
                            </h2>
                            <BarListChart data={ratingData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-3 mb-4">
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <h2 className="h6 fw-bold mb-3">Derniers commentaires</h2>
                            {comments.length === 0 && <p className="text-muted small mb-0">Aucun commentaire.</p>}
                            {comments.slice(-5).reverse().map((comment) => (
                                <div key={comment.id} className="admin-activity-item">
                                    <div className="d-flex justify-content-between align-items-start gap-2">
                                        <span className="fw-semibold small">{comment.destination_name}</span>
                                        {comment.rating && <Badge bg="warning" text="dark">{comment.rating}/5</Badge>}
                                    </div>
                                    <p className="text-muted small mb-0 text-truncate">{comment.content}</p>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <h2 className="h6 fw-bold mb-3">Derniers messages de contact</h2>
                            {messages.length === 0 && <p className="text-muted small mb-0">Aucun message.</p>}
                            {messages.slice(-5).reverse().map((message, index) => (
                                <div key={message.id ?? index} className="admin-activity-item">
                                    <div className="d-flex justify-content-between align-items-start gap-2">
                                        <span className="fw-semibold small">{message.name}</span>
                                    </div>
                                    <p className="text-muted small mb-0 text-truncate">{message.subject}</p>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-4 d-flex flex-wrap gap-2">
                    <Button as={Link} to="/admin/destinations" className="btn-gradient" size="sm">
                        <FiPlus className="mb-1 me-1" /> Nouvelle destination
                    </Button>
                    <Button as={Link} to="/admin/comments" variant="outline-primary" size="sm">
                        Voir les commentaires
                    </Button>
                    <Button as={Link} to="/admin/users" variant="outline-primary" size="sm">
                        Gérer les utilisateurs
                    </Button>
                    <Button as={Link} to="/admin/contacts" variant="outline-primary" size="sm">
                        Voir les messages
                    </Button>
                </Card.Body>
            </Card>
        </>
    )
}

export default AdminOverviewPage
