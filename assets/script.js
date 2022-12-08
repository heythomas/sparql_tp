function makeSPARQLQuery( endpointUrl, sparqlQuery, doneCallback ) {
	var settings = {
		headers: { Accept: 'application/sparql-results+json' },
		data: { query: sparqlQuery }
	};
    console.log()
	return $.ajax( endpointUrl, settings ).then( doneCallback );
}

document.getElementById("war").addEventListener("change", function () {
    sparqlQuery = "SELECT DISTINCT ?item ?itemLabel ?lat ?long WHERE {\n" +
        "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\". }\n" +
        "  {\n" +
        "    SELECT DISTINCT ?item ?lat ?long WHERE {\n" +
        "      ?item p:P31 ?statement0.\n" +
        "      ?statement0 (ps:P31/(wdt:P279*)) wd:Q11446.\n" +
        "      ?item p:P607 ?statement1.\n" +
        "      ?statement1 (ps:P607/(wdt:P279*)) wd:" + $("#war").val() + ".\n" +
        "      {\n" +
        "        ?item p:P625 ?statement2.\n" +
        "        ?statement2 (ps:P625) _:anyValueP625.\n" +
        "        FILTER(EXISTS { ?statement2 prov:wasDerivedFrom ?reference. }).\n" +
        "      }.\n" +
        "      ?item p:P625 ?coord.\n" +
        "      ?coord   psv:P625 ?coordValue.\n" +
        "      ?coordValue a wikibase:GlobecoordinateValue;\n" +
        "        wikibase:geoLatitude ?lat;\n" +
        "        wikibase:geoLongitude ?long.\n" +
        "    }\n" +
        "  }\n" +
        "}";
    
    $(".leaflet-marker-icon").remove();
    $(".leaflet-popup").remove();
    $(".leaflet-marker-shadow").remove();

    makeSPARQLQuery( endpointUrl, sparqlQuery, function( data ) {
        data.results.bindings.forEach(element => {
            L.marker([element.lat.value, element.long.value]).addTo(map).bindPopup('<a href="'+element.item.value+'">'+element.itemLabel.value+'</a>');
        });
    });
})

// Init
var endpointUrl = 'https://query.wikidata.org/sparql',
	sparqlQuery = "SELECT DISTINCT ?item ?itemLabel ?lat ?long WHERE {\n" +
        "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"en\". }\n" +
        "  {\n" +
        "    SELECT DISTINCT ?item ?lat ?long WHERE {\n" +
        "      ?item p:P31 ?statement0.\n" +
        "      ?statement0 (ps:P31/(wdt:P279*)) wd:Q11446.\n" +
        "      ?item p:P607 ?statement1.\n" +
        "      ?statement1 (ps:P607/(wdt:P279*)) wd:Q184425.\n" +
        "      {\n" +
        "        ?item p:P625 ?statement2.\n" +
        "        ?statement2 (ps:P625) _:anyValueP625.\n" +
        "        FILTER(EXISTS { ?statement2 prov:wasDerivedFrom ?reference. }).\n" +
        "      }.\n" +
        "      ?item p:P625 ?coord.\n" +
        "      ?coord   psv:P625 ?coordValue.\n" +
        "      ?coordValue a wikibase:GlobecoordinateValue;\n" +
        "        wikibase:geoLatitude ?lat;\n" +
        "        wikibase:geoLongitude ?long.\n" +
        "    }\n" +
        "  }\n" +
        "}";

var map = L.map('map').setView([45.6418973, 5.8703632], 3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

makeSPARQLQuery( endpointUrl, sparqlQuery, function( data ) {
    data.results.bindings.forEach(element => {
        L.marker([element.lat.value, element.long.value]).addTo(map).bindPopup('<a href="'+element.item.value+'">'+element.itemLabel.value+'</a>');
    });
});
