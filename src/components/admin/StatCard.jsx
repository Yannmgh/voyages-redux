import { Card } from "react-bootstrap"

function StatCard({ icon, label, value, accent = "teal" }) {
    return (
        <Card className="stat-card border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center gap-3">
                <span className={`stat-card-icon stat-card-icon-${accent}`}>{icon}</span>
                <div>
                    <p className="stat-card-value mb-0">{value}</p>
                    <p className="stat-card-label mb-0">{label}</p>
                </div>
            </Card.Body>
        </Card>
    )
}

export default StatCard
