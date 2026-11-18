import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"

function DestinationCard({ destination }) {
    return (
        <Card
            as={Link}
            to={`/destinations/${destination.slug}`}
            className="destination-card border-0 h-100 d-block text-decoration-none"
        >
            <div className="destination-card-media">
                <img src={destination.image} alt={destination.name} />
                <span className="destination-card-badge">{destination.region}</span>
                <div className="destination-card-info">
                    <h3 className="h5 fw-bold text-white mb-1">{destination.name}</h3>
                    <p className="text-white-50 small mb-0">Capitale : {destination.capital}</p>
                </div>
            </div>
        </Card>
    )
}

export default DestinationCard
