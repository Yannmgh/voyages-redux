import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import * as yup from "yup"
import { clearAuthError, loginUser } from "../features/auth/authSlice"

const loginSchema = yup.object({
    username: yup
        .string()
        .required("Le nom d'utilisateur est obligatoire"),
    password: yup
        .string()
        .required("Le mot de passe est obligatoire"),
})

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { status, error } = useSelector((state) => state.auth)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    useEffect(() => {
        dispatch(clearAuthError())
    }, [dispatch])

    const onSubmit = async (data) => {
        try {
            await dispatch(loginUser(data)).unwrap()
            navigate(location.state?.from?.pathname ?? "/", { replace: true })
        } catch {
            // l'erreur est déjà exposée via le state Redux (error)
        }
    }

    return (
        <div className="auth-shell">
            <Card className="auth-card border-0">
                <Row className="g-0">
                    <Col md={5} className="d-none d-md-flex">
                        <div className="auth-visual">
                            <span className="auth-visual-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V18l-2.5 2v1.5l4-1 4 1V20l-2.5-2v-4.5l8 2.5z" fill="currentColor" stroke="none" />
                                </svg>
                            </span>
                            <p className="hero-eyebrow text-white-50 fw-bold mb-2">Bon retour</p>
                            <h2 className="font-display fw-bold">Prêt pour votre prochaine aventure ?</h2>
                            <p className="mb-0 opacity-75">
                                Connectez-vous pour retrouver votre profil et vos destinations favorites.
                            </p>
                        </div>
                    </Col>
                    <Col md={7}>
                        <Card.Body className="p-4 p-md-5">
                            <h1 className="font-display fw-bold mb-4">Connexion</h1>

                            {location.state?.registered && (
                                <Alert variant="success">
                                    Compte créé ! Vous pouvez maintenant vous connecter avec vos identifiants.
                                </Alert>
                            )}

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Nom d'utilisateur</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Votre nom d'utilisateur"
                                        isInvalid={!!errors.username}
                                        {...register("username")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.username?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-4">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Votre mot de passe"
                                        isInvalid={!!errors.password}
                                        {...register("password")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button type="submit" className="btn-gradient w-100" disabled={status === "loading"}>
                                    {status === "loading" ? "Connexion..." : "Se connecter"}
                                </Button>
                            </Form>

                            <p className="mt-4 mb-0 text-center">
                                Pas encore de compte ?{" "}
                                <Link to="/register" state={location.state}>
                                    Créer un compte
                                </Link>
                            </p>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default LoginPage
