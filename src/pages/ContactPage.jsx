import { Button, Card, Alert, Form, Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetContactStatus, submitContactMessage } from "../features/contact/contactSlice";

const contactSchema = yup.object({
    name: yup
        .string()
        .required("Le nom est obligatoire"),
    email: yup
        .string()
        .required("L'email est obligatoire")
        .email("L'email est invalide"),
    subject: yup
        .string()
        .required("Le sujet est obligatoire")
        .min(5, "Le sujet doit avoir au moins 5 caractères"),
    message: yup
        .string()
        .required("Le message est obligatoire")
        .min(10, "Le message doit avoir au moins 5 caractères"),
});

const contactInfo = [
    {
        label: "Adresse",
        value: "12 rue des Explorateurs, 75000 Paris",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
    },
    {
        label: "Email",
        value: "contact@voyages.fr",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 6l-10 7L2 6" />
            </svg>
        ),
    },
    {
        label: "Téléphone",
        value: "+33 1 23 45 67 89",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
    },
]

function ContactPage() {
    const dispatch = useDispatch()
    const { submitStatus, submitError } = useSelector((state) => state.contact)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        }
    })

    const onSubmit = async (data) => {
        try {
            await dispatch(submitContactMessage(data)).unwrap()
            reset()
        } catch {
            // l'erreur est déjà exposée via le state Redux (submitError)
        }
    }


    return (
        <Card className="auth-card border-0 mx-auto">
            <Row className="g-0">
                <Col md={5} className="d-none d-md-flex">
                    <div className="auth-visual">
                        <p className="hero-eyebrow text-white-50 fw-bold mb-2">Une question ?</p>
                        <h2 className="font-display fw-bold mb-4">Parlons de votre prochain voyage</h2>
                        <div className="d-flex flex-column gap-3">
                            {contactInfo.map((item) => (
                                <div className="contact-info-item" key={item.label}>
                                    <span className="contact-info-icon">{item.icon}</span>
                                    <div>
                                        <div className="fw-semibold small text-white-50">{item.label}</div>
                                        <div>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
                <Col md={7}>
                    <Card.Body className="p-4 p-md-5">
                        <h1 className="font-display fw-bold mb-4">Contact</h1>

                        {submitStatus === "succeeded" && (
                            <Alert variant="success" dismissible onClose={() => dispatch(resetContactStatus())}>
                                Votre message a bien été envoyé. Nous vous répondrons rapidement !
                            </Alert>
                        )}

                        {submitStatus === "failed" && (
                            <Alert variant="danger" dismissible onClose={() => dispatch(resetContactStatus())}>
                                {submitError}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Votre nom"
                                    isInvalid={!!errors.name}
                                    {...register("name")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
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
                            <Form.Group controlId="subject" className="mb-3">
                                <Form.Label>Sujet</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Votre sujet"
                                    isInvalid={!!errors.subject}
                                    {...register("subject")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.subject?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="message" className="mb-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Votre message"
                                    isInvalid={!!errors.message}
                                    {...register("message")}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.message?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button
                                type="submit"
                                className="btn-gradient mt-2"
                                disabled={submitStatus === "loading"}
                            >
                                {submitStatus === "loading" ? "Envoi..." : "Envoyer"}
                            </Button>
                        </Form>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    )
}

export default ContactPage
