### Code - Validation de formulaire (6 pts)

Formulaire HTML fourni:

```
<form id="formulaire">
  <label for="adresse-email">Votre email:</label>
  <input  id="adresse-email" type="email">
  <label for="profession">Profession:</label>
  <input  id="profession">
  <label for="accepter">J'accepte les termes d'utilisation du service</label>
  <input  id="accepter" type="checkbox">
  <label for="recevoir">Recevoir l'actualité par email</label>
  <input  id="recevoir" type="checkbox">
  <input type="submit">
</form>
```

Votre objectif est de valider la saisie des utilisateurs au moment où ils soumettront le formulaire d'inscription.

Vous allez donc implémenter les règles suivantes en Javascript, dans la fonction attachée à l'événement `onsubmit` du formulaire:
- si l'adresse email est vide, afficher `adresse svp` dans une alerte modale.
- si la profession est vide, afficher `profession svp` dans une alerte modale.
- si la profession vaut `président`, afficher `j'en doute` dans une alerte modale.
- si la case d'acceptation des termes d'utilisation n'a pas été cochée, afficher `acceptez svp` dans une alerte modale.
- ne jamais afficher plus d'une alerte modale d'affilée => chacun des cas ci-dessus annule immédiatement la soumission du formulaire, pour permettre à l'utilisateur de modifier sa saisie avant de soumettre à nouveau.
- si aucune erreur de validation n'a été rencontrée, laisser le formulaire se soumettre (comportement par défaut).
- si aucune erreur de validation n'a été rencontrée et que l'utilisateur a coché la case pour recevoir l'actualité par email, afficher `vous allez recevoir de la pub` dans une alerte modale.

Votre code sera noté sur le respect des règles, et des messages. => Veillez à respecter l'ordre de validation des règles fournies ci-dessus, ainsi que le texte exact des messages à afficher dans les alertes modales.

Votre code doit être rédigé en Javascript, et utiliser seulement les fonctions natives du DOM. L'utilisation de jQuery ou tout autre module externe est interdite.

Il est recommandé de tester votre code à l'aide de jsbin ou de Chrome Devtools.

Saisissez votre code Javascript ci-dessous:
