import { useEffect } from "react"
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import DestinationCard from "../components/DestinationCard"
import { fetchDestinations } from "../features/destinations/destinationsSlice"
import { removeFavorite } from "../features/favorites/favoritesSlice"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { useToast } from "../hooks/useToast"

function RemoveButton({ onClick, label }) {
    return (
        <Button
            variant="light"
            className="favorite-remove-btn"
            onClick={onClick}
            aria-label={label}
            title="Retirer des favoris"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </Button>
    )
}

function FavoritesPage() {
    useDocumentTitle("Mes favoris")
    const dispatch = useDispatch()
    const showToast = useToast()
    const { items: favorites, status: favoritesStatus } = useSelector((state) => state.favorites)
    const { items: destinations, status: destinationsStatus } = useSelector((state) => state.destinations)

    useEffect(() => {
        if (destinationsStatus === "idle") {
            dispatch(fetchDestinations())
        }
    }, [dispatch, destinationsStatus])

    return (
        <section>
            <div className="text-center mb-5">
                <h1 className="section-heading mx-auto-underline font-display fw-bold mb-3">Mes favoris</h1>
                <p className="text-muted mb-0">Retrouvez les destinations que vous avez sauvegardées</p>
            </div>

            {favoritesStatus === "loading" && (
                <div className="d-flex justify-content-center mb-4">
                    <Spinner animation="border" />
                </div>
            )}

            {favoritesStatus === "succeeded" && favorites.length > 0 && (
                <Row className="g-4">
                    {favorites.map((favorite) => {
                        const destination = destinations.find(
                            (item) => String(item.id) === String(favorite.destination_id)
                        )

                        return (
                            <Col md={6} lg={4} key={favorite.destination_id}>
                                <div className="position-relative h-100">
                                    {destination ? (
                                        <DestinationCard destination={destination} />
                                    ) : (
                                        <Card className="destination-card border-0 h-100">
                                            <div className="destination-card-media">
                                                <img src={favorite.destination_image} alt={favorite.destination_title} />
                                                <div className="destination-card-info">
                                                    <h3 className="h5 fw-bold text-white mb-1">{favorite.destination_title}</h3>
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                                    <RemoveButton
                                        onClick={async () => {
                                            await dispatch(removeFavorite(favorite.destination_id))
                                            showToast(`${favorite.destination_title} retirée des favoris.`)
                                        }}
                                        label={`Retirer ${favorite.destination_title} des favoris`}
                                    />
                                </div>
                            </Col>
                        )
                    })}
                </Row>
            )}

            {favoritesStatus === "succeeded" && favorites.length === 0 && (
                <Alert variant="light" className="text-center">
                    Vous n'avez pas encore de destination favorite.{" "}
                    <Link to="/destinations">Découvrez nos destinations</Link>.
                </Alert>
            )}
        </section>
    )
}

export default FavoritesPage
