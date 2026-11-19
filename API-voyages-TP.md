compte admin : login : admin - password : Admin@123

- Faire la page profil : on affiche les données utilisateur
- Faire dans reducer de authSlice l'action logout puis permettre le logout de l'utilisateur
- Mettre en place register
    - ajout de registerUser dans authSLice
    - ajout des addCase liés à registerUser
- Tester : on crée un ou des comptes et on se connecte avec
- Après une inscription, on redirige vers login 

- Faire une route protégée pour le statut admin
- préparer un lien dans le menu si l'utilisateur est admin : dashboard

- Pour les avatars : https://www.dicebear.com/

 
- Faire le contactSlice 
	- enregistrement d'un contact
    - récupération des contacts pour un role admin
- Mettre en place l'enregistrement lors de la soumission du formulaire de contact
	- Si l'utilisateur est connecté, le form doit être pré rempli (name, email)
    - Si l'utilisateur est connecté, il faudra fournir son id (user_id)
- Faire la page d'administration pour l'admin (dashboard)
	- Faire des sous pages : 	
    	- affichage des contacts
        - affichages des users

- Slices :
    - destinationsSlice
        - création d'une destination (admin)
        - récupération des destinations
        - récupération des détails d'une destination
        - récupération des destinations d'une région
        - suppression d'une destination (uniquement le créateur (admin) peut supprimer la destination concernée)

        - Rajouter une page dans l'administration pour lister (tableau html) les destinations
            - Si l'admin est le créateur affichage d'un bouton pour pouvoir la supprimer
                - Mettre une confirmation pour éviter le clic par erreur

    - commentsSlice
        - Un utilisateur connecté peut commenter une destinations sur la page de détail de la destination
        - On affiche les commentaires liés à une destination dans la page détails
        - On affiche les commentaires d'un utilisateur dans son profil (ou une sous page du profil)

        - Rajouter une page dans l'administration pour lister (tableau html) les commentaires
            - L'admin peut supprimer les commentaires (le site est responsable des publications, les commentaires en font partie)
                - Mettre une confirmation pour éviter le clic par erreur

    - favoritesSlice
        - Un utilisateur connecté peut mettre une destination en favori
        - Un utilisateur peut supprimer la destination de ses favoris
            - prévoir un bouton ou un icone sur la page détail d'une destination pour ajouter ou supprimer le favori
        L'utilisateur peut voir la liste des ses destinations favorites sur sa page profil (ou une sous page)

    - usersSlice
        - Admin
            - récupération des utilisateurs
            - l'admin peut modifier le password d'un utilisateur
        - Utilisateur
            - possibilité de modifier ses informations (sauf le password)
            - possibilité de modifier son password indépendamment du reste de ses informations

    - searchSlice
        - Possibilité de rechercher par mot clés (recherche sur name, capital, slug)
        - Possibilité de rechercher par region
        - Possibilité de rechercher par mot clé sur une région spécifique

    - themeSlice
        - permet de passer le site en dark mode / light mode (localStorage)

- Amélioration de l'UI
    - Améliorer la mise en forme du site
    - Utilisation des modal de bootstrap (ou autre que bootstrap) pour des confirmations par exemple, l'ajout d'un favori, la modification du profile, du password etc.
    - Affichage d'une map dans les pages detail d'une destination en utilisant les informations lat/long