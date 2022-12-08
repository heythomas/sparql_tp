/**
 * 
 * BELLON Thomas, DOMPNIER Thomas, VITRY Benjamin
 * 
 */

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
        d3sparql.forcegraph(data);
        $('.forcegraph').hide();
    });
})

$('#toggler').click(function () {
    $('.forcegraph').fadeToggle();
});

// Graph function

d3sparql.forcegraph = function(json, config) {
    config = config || {}
  
    var graph = (json.head && json.results) ? d3sparql.graph(json, config) : json
  
    var scale = d3.scale.linear()
      .domain(d3.extent(graph.nodes, function(d) { return parseFloat(d.value) }))
      .range([1, 20])
  
    var opts = {
      "radius":    config.radius    || function(d) { return d.value ? scale(d.value) : 1 + d.label.length },
      "charge":    config.charge    || -500,
      "distance":  config.distance  || 50,
      "width":     config.width     || 1000,
      "height":    config.height    || 500,
      "label":     config.label     || false,
      "selector":  config.selector  || null
    }
  
    var svg = d3sparql.select(opts.selector, "forcegraph").append("svg")
      .attr("width", opts.width)
      .attr("height", opts.height)
    var link = svg.selectAll(".link")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("class", "link")
    var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("g")
    var circle = node.append("circle")
      .attr("class", "node")
      .attr("r", opts.radius)
    var text = node.append("text")
      .text(function(d) { return d[opts.label || "label"] })
      .attr("class", "node")
    var force = d3.layout.force()
      .charge(opts.charge)
      .linkDistance(opts.distance)
      .size([opts.width, opts.height])
      .nodes(graph.nodes)
      .links(graph.links)
      .start()
    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x })
          .attr("y1", function(d) { return d.source.y })
          .attr("x2", function(d) { return d.target.x })
          .attr("y2", function(d) { return d.target.y })
      text.attr("x", function(d) { return d.x })
          .attr("y", function(d) { return d.y })
      circle.attr("cx", function(d) { return d.x })
            .attr("cy", function(d) { return d.y })
    })
    node.call(force.drag)
  
    // default CSS/SVG
    link.attr({
      "stroke": "#999999",
    })
    circle.attr({
      "stroke": "black",
      "stroke-width": "1px",
      "fill": "lightblue",
      "opacity": 1,
    })
    text.attr({
      "font-size": "8px",
      "font-family": "sans-serif",
    })
  }

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
    d3sparql.forcegraph(data)
    $('.forcegraph').hide();
});
