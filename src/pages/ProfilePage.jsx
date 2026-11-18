import { useEffect } from "react"
import { Alert, Button, Card, Image, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchProfile, logout } from "../features/auth/authSlice"

const HIDDEN_FIELDS = new Set(["accessToken", "token", "password"])

function formatLabel(key) {
    return key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/^./, (char) => char.toUpperCase())
}

function renderValue(value) {
    if (value === null || value === undefined || value === "") {
        return "—"
    }

    if (typeof value === "object") {
        return (
            <ul className="list-unstyled ms-3 mb-0">
                {Object.entries(value).map(([key, nested]) => (
                    <li key={key}>
                        <span className="fw-bold">{formatLabel(key)} :</span>{" "}
                        {typeof nested === "object" && nested !== null ? JSON.stringify(nested) : String(nested)}
                    </li>
                ))}
            </ul>
        )
    }

    return String(value)
}

function ProfilePage() {
    const dispatch = useDispatch()
    const { profile, status, error } = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])

    const loading = status === "loading" && !profile

    return (
        <Card className="mx-auto w-100 shadow-sm border-0" style={{ maxWidth: "680px" }}>
            <Card.Body className="p-4 p-md-5">
                <h1 className="section-heading font-display fw-bold mb-4">Mon profil</h1>

                {loading && (
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Spinner animation="border" size="sm" />
                        <span>Chargement de votre profil...</span>
                    </div>
                )}

                {status === "failed" && error && <Alert variant="danger">{error}</Alert>}

                {profile && (
                    <>
                        {(profile.avatar || profile.image) && (
                            <div className="text-center mb-4">
                                <span className="profile-avatar-ring">
                                    <Image
                                        src={profile.avatar || profile.image}
                                        alt={profile.username}
                                        roundedCircle
                                        width={96}
                                        height={96}
                                    />
                                </span>
                            </div>
                        )}

                        <ul className="list-unstyled profile-field-list mb-4">
                            {Object.entries(profile)
                                .filter(([key]) => !HIDDEN_FIELDS.has(key))
                                .map(([key, value]) => (
                                    <li key={key}>
                                        <span className="fw-bold">{formatLabel(key)} :</span> {renderValue(value)}
                                    </li>
                                ))}
                        </ul>
                    </>
                )}

                <div className="d-flex flex-wrap gap-2">
                    <Button as={Link} to="/favorites" className="btn-gradient">
                        Voir mes favoris
                    </Button>
                    <Button variant="outline-primary" onClick={() => dispatch(logout())}>
                        Se déconnecter
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default ProfilePage
