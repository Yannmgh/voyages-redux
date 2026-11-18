import { Button, Card } from "react-bootstrap"
import { Link } from "react-router-dom"

function NotFoundPage() {
    return (
        <section>
            <Card className="border-0 shadow-sm overflow-hidden text-center">
                <Card.Body className="p-5">
                    <div className="notfound-icon">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                        </svg>
                    </div>
                    <p
                        className="font-display fw-bold mb-3"
                        style={{
                            fontSize: "5rem",
                            lineHeight: 1,
                            background: "var(--vy-gradient-sunset)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        404
                    </p>
                    <h1 className="h4 mb-3">Oups, cette destination n'existe pas</h1>
                    <p className="text-muted mb-4">
                        La page que vous recherchez a peut-être changé d'adresse ou n'a jamais existé.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button as={Link} to="/" className="btn-gradient">
                            Retour à l'accueil
                        </Button>
                        <Button as={Link} to="/destinations" variant="outline-primary">
                            Voir les destinations
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </section>
    )
}

export default NotFoundPage
