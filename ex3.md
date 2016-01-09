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

Votre code doit être rédigé en Javascript, et utiliser seulement les fonctions natives du DOM. L'utilisation de jQuery ou tout autre module externe est interdite.

Il est recommandé de tester votre code à l'aide de jsbin ou de Chrome Devtools.
