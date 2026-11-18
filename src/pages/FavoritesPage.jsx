import { Alert, Button, Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import DestinationCard from "../components/DestinationCard"
import { useFavorites } from "../context/FavoritesContext"
import { destinations } from "../data/destinations"

function FavoritesPage() {
    const { favorites, removeFavorite } = useFavorites()
    const favoriteDestinations = destinations.filter((destination) => favorites.includes(destination.slug))

    return (
        <section>
            <div className="text-center mb-5">
                <h1 className="section-heading mx-auto-underline font-display fw-bold mb-3">Mes favoris</h1>
                <p className="text-muted mb-0">Retrouvez les destinations que vous avez sauvegardées</p>
            </div>

            {favoriteDestinations.length > 0 ? (
                <Row className="g-4">
                    {favoriteDestinations.map((destination) => (
                        <Col md={6} lg={4} key={destination.id}>
                            <div className="position-relative h-100">
                                <DestinationCard destination={destination} />
                                <Button
                                    variant="light"
                                    className="favorite-remove-btn"
                                    onClick={() => removeFavorite(destination.slug)}
                                    aria-label={`Retirer ${destination.name} des favoris`}
                                    title="Retirer des favoris"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </Button>
                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Alert variant="light" className="text-center">
                    Vous n'avez pas encore de destination favorite.{" "}
                    <Link to="/destinations">Découvrez nos destinations</Link>.
                </Alert>
            )}
        </section>
    )
}

export default FavoritesPage
