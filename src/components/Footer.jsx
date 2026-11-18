import { Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer className="vy-footer pt-5 pb-4">
            <Container>
                <Row className="g-4">
                    <Col md={4}>
                        <span className="brand-text fs-4">Voyages</span>
                        <p className="mt-3 mb-0 small">
                            Des idées de voyages, des destinations à explorer et un carnet pour garder vos
                            favoris à portée de main.
                        </p>
                    </Col>
                    <Col md={4}>
                        <h6>Explorer</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                            <li><Link to="/">Accueil</Link></li>
                            <li><Link to="/destinations">Destinations</Link></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h6>Informations</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                            <li><Link to="/about">A propos</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </Col>
                </Row>
                <hr />
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small">
                    <span>© {new Date().getFullYear()} Voyages — Partez à la découverte du monde</span>
                    <span>Projet pédagogique Cloud Campus</span>
                </div>
            </Container>
        </footer>
    )
}

export default Footer
