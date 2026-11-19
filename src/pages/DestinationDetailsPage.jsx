import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import * as yup from "yup"
import DestinationCard from "../components/DestinationCard"
import { createComment, deleteComment, fetchCommentsByDestination } from "../features/comments/commentsSlice"
import { fetchDestinationBySlug, fetchDestinations } from "../features/destinations/destinationsSlice"
import { addFavorite, removeFavorite } from "../features/favorites/favoritesSlice"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { useConfirm } from "../hooks/useConfirm"
import { useToast } from "../hooks/useToast"

function HeartIcon({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

const commentSchema = yup.object({
  content: yup.string().required("Le commentaire ne peut pas être vide").min(3, "3 caractères minimum"),
  rating: yup.number().transform((value, original) => (original === "" ? undefined : value)).nullable().min(1).max(5),
})

function CommentsSection({ destinationId, destinationSlug, user }) {
  const dispatch = useDispatch()
  const showToast = useToast()
  const { confirm, confirmModal } = useConfirm()
  const { byDestination: comments, byDestinationStatus: status, createStatus } = useSelector((state) => state.comments)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: { content: "", rating: "" },
  })

  useEffect(() => {
    dispatch(fetchCommentsByDestination(destinationId))
  }, [dispatch, destinationId])

  const onSubmit = async (data) => {
    try {
      await dispatch(createComment({ destination_id: destinationId, ...data })).unwrap()
      reset()
      dispatch(fetchCommentsByDestination(destinationId))
      showToast("Votre avis a été publié.")
    } catch {
      // l'erreur est déjà exposée via le state Redux (createStatus/createError côté slice)
    }
  }

  const handleDelete = async (id) => {
    const ok = await confirm({ title: "Supprimer ce commentaire ?", body: "Cette action est irréversible." })
    if (ok) {
      await dispatch(deleteComment(id))
      showToast("Commentaire supprimé.")
    }
  }

  return (
    <section className="mt-5">
      <h2 className="section-heading font-display fw-bold mb-4">Avis et commentaires</h2>

      {status === "loading" && (
        <div className="d-flex justify-content-center mb-4">
          <Spinner animation="border" />
        </div>
      )}

      {status === "succeeded" && comments.length === 0 && (
        <Alert variant="light">Aucun commentaire pour le moment.</Alert>
      )}

      {status === "succeeded" && comments.length > 0 && (
        <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
          {comments.map((comment) => (
            <li key={comment.id}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    {comment.rating && <Badge bg="warning" text="dark" className="mb-2">{comment.rating} / 5</Badge>}
                    <p className="mb-0">{comment.content}</p>
                  </div>
                  {user?.role === "admin" && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(comment.id)}
                    >
                      Supprimer
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h3 className="h6 fw-bold mb-3">Laisser un avis</h3>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="comment-content" className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Votre commentaire"
                  isInvalid={!!errors.content}
                  {...register("content")}
                />
                <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="comment-rating" className="mb-3" style={{ maxWidth: "200px" }}>
                <Form.Label>Note (optionnel)</Form.Label>
                <Form.Select {...register("rating")}>
                  <option value="">Non noté</option>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>{value} / 5</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="btn-gradient" disabled={createStatus === "loading"}>
                {createStatus === "loading" ? "Envoi..." : "Publier"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <p className="text-muted">
          <Link to="/login" state={{ from: { pathname: `/destinations/${destinationSlug}` } }}>
            Connectez-vous
          </Link>{" "}
          pour laisser un avis.
        </p>
      )}
      {confirmModal}
    </section>
  )
}

function DestinationDetailsPage() {
  const { slug } = useParams() // récupération du paramètre dans l'url via useParams()
  const dispatch = useDispatch()
  const showToast = useToast()
  const user = useSelector((state) => state.auth.user)
  const favoriteItems = useSelector((state) => state.favorites.items)

  const destination = useSelector((state) => state.destinations.current)
  const currentStatus = useSelector((state) => state.destinations.currentStatus)
  const { items: allDestinations, status: itemsStatus } = useSelector((state) => state.destinations)

  useDocumentTitle(destination?.name)

  useEffect(() => {
    dispatch(fetchDestinationBySlug(slug))
  }, [dispatch, slug])

  useEffect(() => {
    if (itemsStatus === "idle") {
      dispatch(fetchDestinations())
    }
  }, [dispatch, itemsStatus])

  if (currentStatus === "loading" || currentStatus === "idle") {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    )
  }

  if (currentStatus === "failed" || !destination) {
    return (
      <section className="text-center py-5">
        <h1 className="h3 fw-bold mb-3">La destination recherchée est introuvable</h1>
        <p className="text-muted mb-4">Elle a peut-être été retirée ou l'adresse est incorrecte.</p>
        <Button as={Link} to="/destinations" className="btn-gradient">
          Retour aux destinations
        </Button>
      </section>
    )
  }

  const favorite = favoriteItems.some((item) => String(item.destination_id) === String(destination.id))
  const otherDestinations = allDestinations.filter((item) => item.slug !== slug).slice(0, 3)
  const lat = Number(destination.lat)
  const long = Number(destination.long)
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${long - 1}%2C${lat - 1}%2C${long + 1}%2C${lat + 1}&layer=mapnik&marker=${lat}%2C${long}`

  const handleToggleFavorite = async () => {
    if (favorite) {
      await dispatch(removeFavorite(destination.id))
      showToast(`${destination.name} retirée des favoris.`)
    } else {
      await dispatch(addFavorite({ destinationId: destination.id, title: destination.name, image: destination.image }))
      showToast(`${destination.name} ajoutée aux favoris.`)
    }
  }

  return (
    <>
      <div className="detail-hero">
        <img src={destination.image} alt={destination.name} />
        <div className="detail-hero-overlay">
          <Container>
            <Badge bg="primary" className="mb-3">
              {destination.region_name}
            </Badge>
            <h1 className="display-5 font-display fw-bold text-white mb-2">{destination.name}</h1>
            <p className="text-white-50 mb-0">Capitale : {destination.capital}</p>
          </Container>
        </div>
      </div>

      <Container>
        <Row className="g-4 position-relative" style={{ marginTop: "-3rem", zIndex: 2 }}>
          <Col lg={8}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-4 p-md-5">
                <h2 className="h4 fw-bold mb-3">À propos de {destination.name}</h2>
                <p className="text-muted mb-4">{destination.description}</p>
                <Button as={Link} to="/destinations" variant="outline-primary">
                  Retour aux destinations
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-4">
                <h3 className="h6 text-uppercase text-muted mb-3">Informations</h3>
                <ul className="list-unstyled profile-field-list mb-4">
                  <li>
                    <span className="fw-bold">Région :</span> {destination.region_name}
                  </li>
                  <li>
                    <span className="fw-bold">Capitale :</span> {destination.capital}
                  </li>
                </ul>

                {user ? (
                  <Button
                    variant={favorite ? "danger" : "outline-primary"}
                    className="favorite-toggle-btn w-100"
                    onClick={handleToggleFavorite}
                  >
                    <HeartIcon filled={favorite} />
                    {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline-secondary"
                      className="favorite-toggle-btn w-100"
                      disabled
                    >
                      <HeartIcon filled={false} />
                      Ajouter aux favoris
                    </Button>
                    <p className="text-muted small mt-2 mb-0">
                      <Link to="/login" state={{ from: { pathname: `/destinations/${destination.slug}` } }}>
                        Connectez-vous
                      </Link>{" "}
                      pour ajouter cette destination à vos favoris.
                    </p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {destination.lat && destination.long && (
          <section className="mt-5">
            <h2 className="section-heading font-display fw-bold mb-4">Localisation</h2>
            <div className="ratio ratio-21x9 rounded overflow-hidden shadow-sm map-frame">
              <iframe title={`Carte de ${destination.name}`} src={mapSrc} style={{ border: 0 }} loading="lazy" />
            </div>
          </section>
        )}

        <CommentsSection destinationId={destination.id} destinationSlug={destination.slug} user={user} />

        {otherDestinations.length > 0 && (
          <section className="mt-5 mb-5">
            <h2 className="section-heading font-display fw-bold mb-4">Autres destinations à découvrir</h2>
            <Row className="g-4">
              {otherDestinations.map((item) => (
                <Col md={4} key={item.id}>
                  <DestinationCard destination={item} />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Container>
    </>
  )
}

export default DestinationDetailsPage
