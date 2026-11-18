import { Card, Col, Row } from "react-bootstrap"

const values = [
    {
        title: "Curiosité",
        text: "Nous aimons dénicher des lieux qui sortent des sentiers battus, autant que les grands classiques.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
    },
    {
        title: "Simplicité",
        text: "Des informations claires et directes pour préparer un voyage sans prise de tête.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
    },
    {
        title: "Partage",
        text: "Une communauté de voyageurs qui échangent idées, conseils et bonnes adresses.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
        ),
    },
]

function AboutPage() {
    return (
        <section>
            <Card className="border-0 shadow-sm overflow-hidden mb-5">
                <Row className="g-0 align-items-stretch">
                    <Col md={6}>
                        <Card.Body className="p-5">
                            <p className="hero-eyebrow fw-bold mb-2">Notre histoire</p>
                            <h1 className="font-display fw-bold mb-3">A propos de Voyages</h1>
                            <p className="mb-2">
                                Voyages est un site proposant des idées de voyages, de découvertes, de parcours...
                                Découvrez des destinations, préparez vos voyages et sauvegardez vos lieux favoris.
                            </p>
                            <p className="mb-0 text-muted">
                                Auto-stop, Aventure, Camping sauvage, Circuit touristique, Covoiturage, Evasion,
                                Excursion, Exploration, Expédition, Périple, Promenade...
                            </p>
                        </Card.Body>
                    </Col>
                    <Col md={6}>
                        <img
                            className="about-hero-image"
                            src="https://picsum.photos/seed/voyages-about/900/700"
                            alt="Voyageur face à un paysage"
                        />
                    </Col>
                </Row>
            </Card>

            <div className="text-center mb-4">
                <h2 className="section-heading mx-auto-underline font-display fw-bold mb-3">Nos valeurs</h2>
                <p className="text-muted mb-0">Ce qui nous guide à chaque nouvelle destination</p>
            </div>
            <Row className="g-4 mb-3">
                {values.map((value) => (
                    <Col md={4} key={value.title}>
                        <div className="value-card text-center">
                            <div className="feature-icon mb-3">{value.icon}</div>
                            <h3 className="h5 fw-bold">{value.title}</h3>
                            <p className="text-muted mb-0">{value.text}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </section>
    );
}

export default AboutPage;
