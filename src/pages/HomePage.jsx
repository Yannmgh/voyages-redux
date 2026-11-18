import { Button, Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import DestinationCard from "../components/DestinationCard"
import { destinations } from "../data/destinations"

const HERO_IMAGE = "https://cdn.pixabay.com/photo/2016/08/14/13/43/gorges-du-verdon-1592934_1280.jpg"

const features = [
    {
        title: "Des idées sur-mesure",
        text: "Des destinations sélectionnées pour tous les envies : nature, culture, aventure ou farniente.",
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
        ),
    },
    {
        title: "Informations fiables",
        text: "Capitale, région, points d'intérêt : toutes les informations utiles avant de partir.",
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
    },
    {
        title: "Favoris sauvegardés",
        text: "Créez un compte pour garder un œil sur les destinations qui vous font rêver.",
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    },
]

function HomePage() {
    const featured = destinations.slice(0, 3)

    return (
        <>
            <div
                className="hero-banner"
                style={{ backgroundImage: `url(${HERO_IMAGE})` }}
            >
                <Container>
                    <p className="hero-eyebrow fw-bold mb-2">Carnet de voyage</p>
                    <h1 className="display-4 font-display fw-bold text-white mb-3" style={{ maxWidth: "640px" }}>
                        Des idées de voyages qui donnent envie de partir
                    </h1>
                    <p className="lead text-white-50 mb-4" style={{ maxWidth: "540px" }}>
                        Découvrez des destinations, préparez vos voyages et sauvegardez vos lieux favoris.
                    </p>
                    <div className="d-flex flex-wrap gap-3">
                        <Button as={Link} to="/destinations" size="lg" className="btn-gradient">
                            Voir les destinations
                        </Button>
                        <Button as={Link} to="/destinations" size="lg" variant="outline-light">
                            Rechercher
                        </Button>
                    </div>
                </Container>
                <div className="hero-scroll-indicator">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>

            <Container>
                <Row className="g-4 my-5 pt-3">
                    {features.map((feature) => (
                        <Col md={4} key={feature.title}>
                            <div className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="h5 fw-bold mt-3">{feature.title}</h3>
                                <p className="text-muted mb-0">{feature.text}</p>
                            </div>
                        </Col>
                    ))}
                </Row>

                <Row className="g-3 mb-5">
                    <Col xs={4}>
                        <div className="stat-tile">
                            <div className="stat-value">{destinations.length}+</div>
                            <div className="text-muted small">Destinations</div>
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="stat-tile">
                            <div className="stat-value">4</div>
                            <div className="text-muted small">Continents</div>
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="stat-tile">
                            <div className="stat-value">100%</div>
                            <div className="text-muted small">Envie de partir</div>
                        </div>
                    </Col>
                </Row>

                <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
                    <h2 className="section-heading font-display fw-bold mb-0">Destinations populaires</h2>
                    <Link to="/destinations" className="fw-semibold text-decoration-none">
                        Tout voir →
                    </Link>
                </div>
                <Row className="g-4 mb-5">
                    {featured.map((destination) => (
                        <Col md={4} key={destination.id}>
                            <DestinationCard destination={destination} />
                        </Col>
                    ))}
                </Row>
            </Container>

            <div className="cta-band">
                <Container className="text-center text-white py-5">
                    <h2 className="font-display fw-bold mb-3">Prêt à préparer votre prochain voyage ?</h2>
                    <p className="mb-4 opacity-75" style={{ maxWidth: "560px", margin: "0 auto" }}>
                        Créez un compte pour retrouver votre profil et garder vos destinations favorites à portée de main.
                    </p>
                    <Button as={Link} to="/register" size="lg" variant="light" className="fw-bold">
                        Créer un compte gratuitement
                    </Button>
                </Container>
            </div>
        </>
    )
}

export default HomePage
