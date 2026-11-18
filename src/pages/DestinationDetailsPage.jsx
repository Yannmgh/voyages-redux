import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import DestinationCard from "../components/DestinationCard"
import { useFavorites } from "../context/FavoritesContext"
import { destinations } from "../data/destinations"

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

function DestinationDetailsPage() {
  const { slug } = useParams() // récupération du paramètre dans l'url via useParams()
  const destination = destinations.find((item) => item.slug === slug)
  const user = useSelector((state) => state.auth.user)
  const { isFavorite, toggleFavorite } = useFavorites()

  if (!destination) {
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

  const favorite = isFavorite(destination.slug)
  const otherDestinations = destinations.filter((item) => item.slug !== slug).slice(0, 3)

  return (
    <>
      <div className="detail-hero">
        <img src={destination.image} alt={destination.name} />
        <div className="detail-hero-overlay">
          <Container>
            <Badge bg="primary" className="mb-3">
              {destination.region}
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
                    <span className="fw-bold">Région :</span> {destination.region}
                  </li>
                  <li>
                    <span className="fw-bold">Capitale :</span> {destination.capital}
                  </li>
                </ul>

                {user ? (
                  <Button
                    variant={favorite ? "danger" : "outline-primary"}
                    className="favorite-toggle-btn w-100"
                    onClick={() => toggleFavorite(destination.slug)}
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
