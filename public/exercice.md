#### Objectif

Dans cet exercice, vous devez remplir deux champs:

1. le code Javascript permettant d'envoyer une requête AJAX, en suivant les consignes ci-dessous;
2. et le nombre qui vous aura été retourné en réponse de cette requête.

Une fois la requête envoyée et les champs de réponse remplis, cliquez sur le bouton "Rendre votre solution".

---

#### Consignes

Votre requête AJAX doit être envoyée de la manière suivante:

- URL de l'API: https://js-exo-ajax.herokuapp.com/api
- méthode d'envoi: POST
- Contenu: un objet JSON contenant deux propriétés:
    - la propriété `ok` vaut `9` (le nombre)
    - la propriété `email` contient votre adresse email (chaîne de caractères)

Vous pouvez faire autant de requêtes sur l'API que vous le souhaitez, dans la limite d'une par seconde maximum.

Il est recommandé d'exécuter/tester votre code à l'aide de jsfiddle ou de la console de Chrome Dev Tools, avant de rendre votre solution depuis cette page.

Tous documents et accès Internet autorisés.

Toute communication / échange d'informations entre étudiants, ou solution identique sera sanctionnée par une note nulle.

---

#### Barème

Vous serez noté sur 5 points, à raison d'un point par critère:

- requête bien reçue par l'API;
- méthode respectée;
- la contenu de la requête reçue contient bien la propriété JSON `ok`;
- la contenu de la requête reçue contient bien votre email dans la propriété JSON `email`;
- le nombre que vous avez saisi ci-dessous correspond bien à celui retourné par l'API en réponse à votre requête.

L'évaluation de votre solution sera automatisée, donc veillez bien à respecter la syntaxe Javascript et les consignes à la lettre.
