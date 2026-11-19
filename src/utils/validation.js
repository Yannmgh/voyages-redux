import * as yup from "yup"

export const passwordField = yup
    .string()
    .required("Le mot de passe est obligatoire")
    .min(8, "8 caractères minimum")
    .matches(/[a-z]/, "Au moins une minuscule")
    .matches(/[A-Z]/, "Au moins une majuscule")
    .matches(/[0-9]/, "Au moins un chiffre")
    .matches(/[^a-zA-Z0-9]/, "Au moins un caractère spécial")
