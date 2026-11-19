import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Alert, Badge, Button, Card, Form, Image, Modal, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import * as yup from "yup"
import { fetchProfile, logout, patchUser } from "../features/auth/authSlice"
import { fetchMyComments } from "../features/comments/commentsSlice"
import { changePassword, clearPasswordStatus, clearUpdateStatus, updateProfile } from "../features/users/usersSlice"
import { passwordField } from "../utils/validation"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { useToast } from "../hooks/useToast"

const GENDER_LABELS = { male: "Homme", female: "Femme", Homme: "Homme", Femme: "Femme", Autre: "Autre" }

const PROFILE_FIELDS = [
    { key: "username", label: "Nom d'utilisateur" },
    { key: "email", label: "Email" },
    { key: "firstName", label: "Prénom" },
    { key: "lastName", label: "Nom" },
    { key: "gender", label: "Genre", format: (value) => GENDER_LABELS[value] ?? value },
    { key: "role", label: "Rôle", format: (value) => (value === "admin" ? "Administrateur" : "Membre") },
]

function renderValue(value) {
    return value === null || value === undefined || value === "" ? "—" : String(value)
}

const profileSchema = yup.object({
    username: yup.string().required("Le nom d'utilisateur est obligatoire").min(4, "4 caractères minimum"),
    email: yup.string().required("L'email est obligatoire").email("L'email est invalide"),
    firstName: yup.string().required("Le prénom est obligatoire"),
    lastName: yup.string().required("Le nom est obligatoire"),
    gender: yup.string().nullable(),
    avatar: yup
        .string()
        .nullable()
        .transform((value) => (value ? value : undefined))
        .url("L'URL de l'avatar est invalide"),
})

function EditProfileModal({ show, onHide, profile }) {
    const dispatch = useDispatch()
    const showToast = useToast()
    const { updateStatus, updateError } = useSelector((state) => state.users)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(profileSchema),
        values: {
            username: profile?.username ?? "",
            email: profile?.email ?? "",
            firstName: profile?.firstName ?? "",
            lastName: profile?.lastName ?? "",
            gender: profile?.gender ?? "",
            avatar: profile?.avatar ?? "",
        },
    })

    const onSubmit = async (data) => {
        try {
            await dispatch(updateProfile(data)).unwrap()
            dispatch(patchUser(data))
            showToast("Profil mis à jour.")
            onHide()
        } catch {
            // l'erreur est déjà exposée via le state Redux (updateError)
        }
    }

    return (
        <Modal
            show={show}
            onHide={() => {
                reset()
                dispatch(clearUpdateStatus())
                onHide()
            }}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Modifier mon profil</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    {updateStatus === "failed" && <Alert variant="danger">{updateError}</Alert>}

                    <Form.Group controlId="profile-username" className="mb-3">
                        <Form.Label>Nom d'utilisateur</Form.Label>
                        <Form.Control type="text" isInvalid={!!errors.username} {...register("username")} />
                        <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="profile-email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" isInvalid={!!errors.email} {...register("email")} />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="profile-firstName" className="mb-3">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control type="text" isInvalid={!!errors.firstName} {...register("firstName")} />
                        <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="profile-lastName" className="mb-3">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control type="text" isInvalid={!!errors.lastName} {...register("lastName")} />
                        <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="profile-gender" className="mb-3">
                        <Form.Label>Genre (optionnel)</Form.Label>
                        <Form.Select {...register("gender")}>
                            <option value="">Non précisé</option>
                            <option value="Femme">Femme</option>
                            <option value="Homme">Homme</option>
                            <option value="Autre">Autre</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="profile-avatar" className="mb-1">
                        <Form.Label>Avatar (optionnel, URL)</Form.Label>
                        <Form.Control type="text" isInvalid={!!errors.avatar} {...register("avatar")} />
                        <Form.Control.Feedback type="invalid">{errors.avatar?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        Annuler
                    </Button>
                    <Button type="submit" className="btn-gradient" disabled={updateStatus === "loading"}>
                        {updateStatus === "loading" ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

const passwordSchema = yup.object({
    currentPassword: yup.string().required("Le mot de passe actuel est obligatoire"),
    newPassword: passwordField,
    confirmPassword: yup
        .string()
        .required("La confirmation est obligatoire")
        .oneOf([yup.ref("newPassword")], "Les mots de passe ne correspondent pas"),
})

function ChangePasswordModal({ show, onHide }) {
    const dispatch = useDispatch()
    const showToast = useToast()
    const { passwordStatus, passwordError } = useSelector((state) => state.users)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(passwordSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    })

    const onSubmit = async (data) => {
        try {
            await dispatch(changePassword(data)).unwrap()
            reset()
            showToast("Mot de passe modifié.")
            onHide()
        } catch {
            // l'erreur est déjà exposée via le state Redux (passwordError)
        }
    }

    return (
        <Modal
            show={show}
            onHide={() => {
                reset()
                dispatch(clearPasswordStatus())
                onHide()
            }}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Changer mon mot de passe</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    {passwordStatus === "failed" && <Alert variant="danger">{passwordError}</Alert>}

                    <Form.Group controlId="current-password" className="mb-3">
                        <Form.Label>Mot de passe actuel</Form.Label>
                        <Form.Control type="password" isInvalid={!!errors.currentPassword} {...register("currentPassword")} />
                        <Form.Control.Feedback type="invalid">{errors.currentPassword?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="new-password" className="mb-3">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control type="password" isInvalid={!!errors.newPassword} {...register("newPassword")} />
                        <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="confirm-password" className="mb-1">
                        <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                        <Form.Control type="password" isInvalid={!!errors.confirmPassword} {...register("confirmPassword")} />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        Annuler
                    </Button>
                    <Button type="submit" className="btn-gradient" disabled={passwordStatus === "loading"}>
                        {passwordStatus === "loading" ? "Enregistrement..." : "Changer le mot de passe"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

function MyCommentsCard() {
    const dispatch = useDispatch()
    const { mine: comments, mineStatus: status, mineError: error } = useSelector((state) => state.comments)

    useEffect(() => {
        dispatch(fetchMyComments())
    }, [dispatch])

    return (
        <Card className="mx-auto w-100 shadow-sm border-0 mt-4" style={{ maxWidth: "680px" }}>
            <Card.Body className="p-4 p-md-5">
                <h2 className="h5 fw-bold mb-4">Mes commentaires</h2>

                {status === "loading" && (
                    <div className="d-flex align-items-center gap-2">
                        <Spinner animation="border" size="sm" />
                        <span>Chargement...</span>
                    </div>
                )}

                {status === "failed" && <Alert variant="danger">{error}</Alert>}

                {status === "succeeded" && comments.length === 0 && (
                    <p className="text-muted mb-0">Vous n'avez pas encore laissé de commentaire.</p>
                )}

                {status === "succeeded" && comments.length > 0 && (
                    <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                        {comments.map((comment) => (
                            <li key={comment.id}>
                                {comment.rating && <Badge bg="warning" text="dark" className="mb-1">{comment.rating} / 5</Badge>}
                                <p className="mb-0">{comment.content}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </Card.Body>
        </Card>
    )
}

function ProfilePage() {
    useDocumentTitle("Mon profil")
    const dispatch = useDispatch()
    const { profile, status, error } = useSelector((state) => state.auth)
    const [showEdit, setShowEdit] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])

    const loading = status === "loading" && !profile

    return (
        <>
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
                            {PROFILE_FIELDS.map(({ key, label, format }) => (
                                <li key={key}>
                                    <span className="fw-bold">{label} :</span>{" "}
                                    {renderValue(format ? format(profile[key]) : profile[key])}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <div className="d-flex flex-wrap gap-2">
                    <Button as={Link} to="/favorites" className="btn-gradient">
                        Voir mes favoris
                    </Button>
                    <Button variant="outline-primary" onClick={() => setShowEdit(true)}>
                        Modifier mon profil
                    </Button>
                    <Button variant="outline-primary" onClick={() => setShowPassword(true)}>
                        Changer mon mot de passe
                    </Button>
                    <Button variant="outline-secondary" onClick={() => dispatch(logout())}>
                        Se déconnecter
                    </Button>
                </div>
            </Card.Body>

            <EditProfileModal show={showEdit} onHide={() => setShowEdit(false)} profile={profile} />
            <ChangePasswordModal show={showPassword} onHide={() => setShowPassword(false)} />
        </Card>

        <MyCommentsCard />
        </>
    )
}

export default ProfilePage
