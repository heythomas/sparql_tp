# BELLON Thomas, DOMPNIER Silvio, VITRY Benjamin

# [FR] - Valorisation d'un graphe de connaissances tiré de Wikidata

Projet de recherche de navires de guerres visitables via des requêtes SPARQL (localisés sur Wikidata).  
Pour lancer le project, ouvrir ``index.html``.  
Il est possible de choisir une guerre via le selecteur en haut au milieu, les points récupérés seront affichés sur la carte.  
Le bouton vert en haut à droite permet d'afficher le graphe des coordonnées géographiques de l'ensemble des noeuds actuellement affichés.  

Plugins utilisés :
- jQuery
  - https://jquery.com/
- d3sparql
  - https://github.com/ktym/d3sparql
- Leaflet
  - https://leafletjs.com/

Le coeur de notre travail se situe dans ``./assets/script.js``.

Pour aller plus loin :
- Pour utiliser une autre requête SPARQL il suffit de modifier le contenu de la fonction ``queryBuilder()`` de ``./assets/script.js``
  - Cette fonction doit proposer des variables des données de résultats ``?itemLabel ?lat ?long`` au minimum.
  - Les paramètres des inputs html sont récupérés avec jQuery (voir la documentation et/ou l'exemple implémenté avec le champ d'id ``war``)

# [EN] - Exploiting a knowledge graph from Wikidata
 
Research projet of warships able to be visited by using SPARQL (located on Wikidata).  
To run the project, simply run ``index.html``.  
To choose a war user the dropdown located at the top of the view, gathered points will be diplayed on the map.  
The green button located on the top right is used to display the graph view that shows the coordinates of the currently displayed ships.  

Plugins used :
- jQuery
  - https://jquery.com/
- d3sparql
  - https://github.com/ktym/d3sparql
- Leaflet
  - https://leafletjs.com/

The majority of our work done is located in ``./assets/script.js``.

To go further :
- To use another SPARQL on this view, simply edit the content of the function ``queryBuilder()`` from ``./assets/script.js``
  - This function at least need to provide the following data results in order to work properly  ``?itemLabel ?lat ?long``.
  - HTML input parameters are retreived with the help of jQuery (see the doc and/or the example used here with the id ``war``)