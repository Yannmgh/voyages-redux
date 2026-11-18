import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import * as yup from "yup"
import { clearAuthError, registerUser } from "../features/auth/authSlice"

const registerSchema = yup.object({
    username: yup
        .string()
        .required("Le nom d'utilisateur est obligatoire")
        .min(4, "Le nom d'utilisateur doit avoir au moins 4 caractères"),
    password: yup
        .string()
        .required("Le mot de passe est obligatoire")
        .min(8, "Le mot de passe doit avoir au moins 8 caractères")
        .matches(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
        .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
        .matches(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    email: yup
        .string()
        .required("L'email est obligatoire")
        .email("L'email est invalide"),
    firstName: yup
        .string()
        .required("Le prénom est obligatoire"),
    lastName: yup
        .string()
        .required("Le nom est obligatoire"),
    gender: yup
        .string()
        .nullable(),
    avatar: yup
        .string()
        .nullable()
        .transform((value) => (value ? value : undefined))
        .url("L'URL de l'avatar est invalide"),
})

function RegisterPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { status, error } = useSelector((state) => state.auth)

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            firstName: "",
            lastName: "",
            gender: "",
            avatar: "",
        },
    })

    useEffect(() => {
        dispatch(clearAuthError())
    }, [dispatch])

    const onSubmit = async (data) => {
        try {
            await dispatch(registerUser(data)).unwrap()
            navigate("/login", { state: { registered: true, from: location.state?.from } })
        } catch (message) {
            if (typeof message === "string" && (message.includes("username") || message.includes("email"))) {
                setError("username", {
                    type: "server",
                    message: "Ce nom d'utilisateur ou cet email est déjà utilisé",
                })
            }
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
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <line x1="19" y1="8" x2="19" y2="14" />
                                    <line x1="22" y1="11" x2="16" y2="11" />
                                </svg>
                            </span>
                            <p className="hero-eyebrow text-white-50 fw-bold mb-2">Bienvenue</p>
                            <h2 className="font-display fw-bold">Créez votre carnet de voyage</h2>
                            <p className="mb-0 opacity-75">
                                Rejoignez la communauté et commencez à préparer vos prochaines découvertes.
                            </p>
                        </div>
                    </Col>
                    <Col md={7}>
                        <Card.Body className="p-4 p-md-5">
                            <h1 className="font-display fw-bold mb-4">Créer un compte</h1>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group controlId="firstName" className="mb-3">
                                            <Form.Label>Prénom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Votre prénom"
                                                isInvalid={!!errors.firstName}
                                                {...register("firstName")}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.firstName?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group controlId="lastName" className="mb-3">
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Votre nom"
                                                isInvalid={!!errors.lastName}
                                                {...register("lastName")}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastName?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

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

                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Votre email"
                                        isInvalid={!!errors.email}
                                        {...register("email")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Votre mot de passe"
                                        isInvalid={!!errors.password}
                                        {...register("password")}
                                    />
                                    <Form.Text muted>
                                        Au moins 8 caractères, avec une minuscule, une majuscule, un chiffre et un caractère spécial.
                                    </Form.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Col sm={6}>
                                        <Form.Group controlId="gender" className="mb-3">
                                            <Form.Label>Genre (optionnel)</Form.Label>
                                            <Form.Select isInvalid={!!errors.gender} {...register("gender")}>
                                                <option value="">Non précisé</option>
                                                <option value="Femme">Femme</option>
                                                <option value="Homme">Homme</option>
                                                <option value="Autre">Autre</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.gender?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group controlId="avatar" className="mb-3">
                                            <Form.Label>Avatar (optionnel)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="https://..."
                                                isInvalid={!!errors.avatar}
                                                {...register("avatar")}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.avatar?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button type="submit" className="btn-gradient w-100 mt-2" disabled={status === "loading"}>
                                    {status === "loading" ? "Création..." : "Créer mon compte"}
                                </Button>
                            </Form>

                            <p className="mt-4 mb-0 text-center">
                                Déjà un compte ?{" "}
                                <Link to="/login" state={location.state}>
                                    Se connecter
                                </Link>
                            </p>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default RegisterPage
