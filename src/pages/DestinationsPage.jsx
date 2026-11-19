import { useEffect } from "react"
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FiSearch } from "react-icons/fi"
import DestinationCard from "../components/DestinationCard"
import { fetchDestinations, fetchRegions } from "../features/destinations/destinationsSlice"
import { searchDestinations } from "../features/search/searchSlice"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { usePagination } from "../hooks/usePagination"
import TablePagination from "../components/TablePagination"

function DestinationsPage() {
    useDocumentTitle("Destinations")
    const dispatch = useDispatch()
    const { items: destinations, status: destinationsStatus, regions, regionsStatus } = useSelector((state) => state.destinations)
    const { results, status: searchStatus } = useSelector((state) => state.search)
    const [searchParams, setSearchParams] = useSearchParams()
    const keyword = searchParams.get("q") || ""
    const region = searchParams.get("region") || "" // slug de la région, vide = toutes

    const hasFilters = Boolean(keyword || region)
    const displayedDestinations = hasFilters ? results : destinations
    const status = hasFilters ? searchStatus : destinationsStatus
    const { page, setPage, pageCount, pageItems } = usePagination(displayedDestinations, 12)

    useEffect(() => {
        if (regionsStatus === "idle") {
            dispatch(fetchRegions())
        }
    }, [dispatch, regionsStatus])

    // Chargement de la liste complète (non filtrée), indépendant du debounce de recherche.
    useEffect(() => {
        if (destinationsStatus === "idle") {
            dispatch(fetchDestinations())
        }
    }, [dispatch, destinationsStatus])

    // Recherche serveur debouncée : ne dépend que des filtres saisis par l'utilisateur,
    // jamais d'un statut que ce même effet ferait évoluer (sinon le timer se réarme en boucle).
    useEffect(() => {
        if (!hasFilters) {
            return undefined
        }

        const timer = setTimeout(() => {
            dispatch(searchDestinations({ keyword, region }))
        }, 350)

        return () => clearTimeout(timer)
    }, [dispatch, keyword, region, hasFilters])

    useEffect(() => {
        setPage(1)
    }, [keyword, region, setPage])

    const updateParams = (changes) => {
        const params = new URLSearchParams(searchParams)

        Object.entries(changes).forEach(([key, value]) => {
            if (!value) {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })

        setSearchParams(params, { replace: true })
    }

    return (
        <section>
            <div className="text-center mb-4">
                <h1 className="section-heading mx-auto-underline font-display fw-bold mb-3">Destinations</h1>
                <p className="text-muted mb-0">Recherchez et choisissez une destination</p>
            </div>

            <Row className="justify-content-center mb-4">
                <Col md={8} lg={6}>
                    <div className="search-field search-field-lg">
                        <FiSearch className="search-field-icon" />
                        <Form.Control
                            type="text"
                            size="lg"
                            placeholder="Rechercher un pays, une région ou une capitale..."
                            value={keyword}
                            onChange={(event) => updateParams({ q: event.target.value })}
                        />
                    </div>
                </Col>
            </Row>

            <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
                <Button
                    size="sm"
                    onClick={() => updateParams({ region: "" })}
                    variant={region === "" ? undefined : "outline-primary"}
                    className={`filter-pill ${region === "" ? "btn-gradient" : ""}`}
                >
                    Toutes
                </Button>
                {regions.map((item) => (
                    <Button
                        key={item.slug}
                        size="sm"
                        onClick={() => updateParams({ region: item.slug })}
                        variant={region === item.slug ? undefined : "outline-primary"}
                        className={`filter-pill ${region === item.slug ? "btn-gradient" : ""}`}
                    >
                        {item.name}
                    </Button>
                ))}
            </div>

            {status === "loading" && (
                <div className="d-flex justify-content-center mb-4">
                    <Spinner animation="border" />
                </div>
            )}

            {status === "failed" && (
                <Alert variant="danger" className="text-center">
                    Impossible de récupérer les destinations pour le moment.
                </Alert>
            )}

            {status === "succeeded" && displayedDestinations.length > 0 ? (
                <>
                    <Row className="g-4">
                        {pageItems.map((destination) => (
                            <Col md={6} lg={4} key={destination.id}>
                                <DestinationCard destination={destination} />
                            </Col>
                        ))}
                    </Row>
                    <TablePagination page={page} pageCount={pageCount} onChange={setPage} />
                </>
            ) : (
                status === "succeeded" && (
                    <Alert variant="light" className="text-center">
                        Aucune destination ne correspond à votre recherche.
                    </Alert>
                )
            )}
        </section>
    )
}

export default DestinationsPage
