import { Spinner } from "react-bootstrap"

function RouteLoader() {
    return (
        <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" style={{ color: "var(--vy-teal)" }} />
        </div>
    )
}

export default RouteLoader
