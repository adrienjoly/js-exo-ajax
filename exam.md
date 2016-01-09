# Partiel Javascript EEMI 1A - Janvier 2016

Les énoncés sont générés de manière individuelle => chaque étudiant a une copie unique.

Toute copie d'un étudiant sur le code source écrit par un autre annulera la note des deux étudiants.

Toute communication avec d'autres personnes pendant l'examen est formellement interdite, et sera sanctionnée immédiatement par une note nulle.

Vous avez 2 heures. Toute soumission tardive sera ignorée.

### QCM - variables (2 pts)

```
var a = 1;
var b = 2;
b++;
alert(a + b);
```

Quelle valeur sera affichée dans l'alerte modale ?

- `4`
- `3`
- `13`
- `12`

### QCM - conditions (2 pts)

```
var a = 1;
var b = 2;
if (a == 1) {
  alert('1er cas');
} else if (a == 1 && b == 2) {
  alert('2eme cas');
} else {
  alert('3eme cas');
}
```

Quelle valeur sera affichée dans l'alerte modale ?

- `1er cas`
- `2eme cas`
- `3eme cas`
- aucune

### QCM - boucle for (2 pts)

```
for(var i = 0; XXX; i++) {
  alert('boom!');
}
```

Que faut-il écrire à la place de `XXX` pour que l'alerte modale *boom!* s'affiche 3 fois ?

- `i <= 3`
- `i < 3`
- `i == 2`
- `i > 2`

### QCM - fonctions (2 pts)

```
function somme(a, b) {
  return a + b;
}
function soustraction(a, b) {
  return a - b;
}
alert(soustraction(somme(1, 2), 4));
```

Quelle valeur sera affichée dans l'alerte modale ?

- `3`
- `1`
- `0`
- `-1`

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

Votre code Javascript:

```
document.getElementById('formulaire').onsubmit = function (evt) {
  /* saisissez votre code entre les accolades */
};
```

Votre code doit être rédigé en Javascript, et utiliser seulement les fonctions natives du DOM. L'utilisation de jQuery ou tout autre module externe est interdite.

Il est recommandé de tester votre code à l'aide de jsbin ou de Chrome Devtools.

### Code - Voyage dans le temps (6 pts)

Quand vous saisissez une requête sur un moteur de recherche, vous obtenez une page de résultats contenant une liste de liens vers des sites en rapport avec cette recherche. Chaque lien est composé d'un titre et d'une URL de destination.

Exemple de page HTML de résultats de recherche:

```
<a class="res" href="http://ebay.com">Acheter et vendre sur Ebay</a>
<a class="res" href="http://yahoo.com">Explorer le web sur Yahoo</a>
<a class="res" href="http://napster.com">Écouter de la musique avec Napster</a>
<a class="res" href="http://meteofrance.com">Prévoir le temps en France</a>
```

Pour faire plaisir à vos nostalgiques parents, vous décidez de développer un programme Javascript permettant de modifier les pages de résultats de recherche, afin que chaque résultat pointe vers une ancienne version du site lié.

Pour accéder à l'ancienne version du site, il suffit de préfixer l'URL du site avec `https://web.archive.org/web/2000/`. Par exemple, l'ancienne version du site `http://toto.com` sera accessible à l'URL `https://web.archive.org/web/2000/http://toto.com`.

Pour chaque lien de la page HTML fournie ci-dessus, votre script devra donc:
- modifier l'URL de destination de lien afin qu'elle mène vers l'ancienne version du site pointé par ce lien;
- modifier l'intitulé du lien, pour que celui-ci se termine par le suffixe `, à l'ancienne`.

Votre code:

```
var results = document.getElementsByClassName('res');
for (var i=0; i<results.length; ++i) {
  var element = results[i];
  console.log(i, element); // affiche l'élément dans la console
  /* saisissez votre code ici */
}
```

Votre code doit être rédigé en Javascript, et utiliser seulement les fonctions natives du DOM. L'utilisation de jQuery ou tout autre module externe est interdite.

Il est recommandé de tester votre code à l'aide de jsbin ou de Chrome Devtools.
