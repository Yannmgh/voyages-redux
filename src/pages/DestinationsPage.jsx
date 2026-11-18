import { Alert, Button, Col, Form, Row } from "react-bootstrap"
import { useSearchParams } from "react-router-dom"
import DestinationCard from "../components/DestinationCard"
import { destinations } from "../data/destinations"

const REGIONS = ["Toutes", "Afrique", "Amerique", "Asie", "Europe"]

function DestinationsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const keywords = searchParams.get("q") || ""
    const activeRegion = searchParams.get("region") || "Toutes"

    const updateParams = (changes) => {
        const params = new URLSearchParams(searchParams)

        Object.entries(changes).forEach(([key, value]) => {
            if (!value || value === "Toutes") {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })

        setSearchParams(params, { replace: true })
    }

    const filteredDestinations = destinations.filter((destination) => {
        const matchesRegion = activeRegion === "Toutes" || destination.region === activeRegion

        const search = keywords.trim().toLowerCase()
        const matchesKeywords =
            !search ||
            destination.name.toLowerCase().includes(search) ||
            destination.region.toLowerCase().includes(search) ||
            destination.capital.toLowerCase().includes(search)

        return matchesRegion && matchesKeywords
    })

    return (
        <section>
            <div className="text-center mb-4">
                <h1 className="section-heading mx-auto-underline font-display fw-bold mb-3">Destinations</h1>
                <p className="text-muted mb-0">Recherchez et choisissez une destination</p>
            </div>

            <Row className="justify-content-center mb-4">
                <Col md={8} lg={6}>
                    <Form.Control
                        type="text"
                        size="lg"
                        placeholder="Rechercher un pays, une région ou une capitale..."
                        value={keywords}
                        onChange={(event) => updateParams({ q: event.target.value })}
                    />
                </Col>
            </Row>

            <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
                {REGIONS.map((region) => (
                    <Button
                        key={region}
                        size="sm"
                        onClick={() => updateParams({ region })}
                        variant={activeRegion === region ? undefined : "outline-primary"}
                        className={`filter-pill ${activeRegion === region ? "btn-gradient" : ""}`}
                    >
                        {region}
                    </Button>
                ))}
            </div>

            {filteredDestinations.length > 0 ? (
                <Row className="g-4">
                    {filteredDestinations.map((destination) => (
                        <Col md={6} lg={4} key={destination.id}>
                            <DestinationCard destination={destination} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Alert variant="light" className="text-center">
                    Aucune destination ne correspond à votre recherche.
                </Alert>
            )}
        </section>
    )
}

export default DestinationsPage
