var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

var g = svg.append("g")
    .attr("class", "background");

svg.on("click", stopped, true);

// [ [long, lat], ... ]
var capitals = [
    [-123.3656, 48.4284], // Victoria, BC
    [-113.4909, 53.5444], // Edmonton, AB
    [ -97.1384, 49.8951], // Winnipeg, MB
    [ -66.6431, 45.9636], // Fredericton, NB
    [ -52.7126, 47.5615], // St John's, NL
    [ -63.5752, 44.6488], // Halifax, NS
    [ -79.3832, 43.6532], // Toronto, ON
    [ -63.1311, 46.2382], // Charlottetown, PE
    [ -71.2080, 46.8139], // Quebec, QC
    [-104.6189, 50.4452], // Regina, SK
    [-135.0568, 60.7212], // Whitehorse, YT
    [ -68.5170, 63.7467], // Iqaluit, NU
    [-114.3718, 62.4540], // Yellowknife, NT
];

d3.json(
    "https://raw.githubusercontent.com/mdgnkm/SIG-Map/master/canada.json",
    function(canada) {
        var active = d3.select(null);

        var projection = d3.geoAlbers()
            .fitSize([width, height], canada);

        window.projection = projection;
        var path = d3.geoPath(projection);

        var provinces = g.selectAll("path")
            .data(canada.features)
            .enter()
            .append("path")
            .attr("class", "feature")
            .attr("d", path)
            .on("click", clicked);

        g.selectAll("circle")
            .data(capitals).enter()
            .append("circle")
            .attr("fill", "red")
            .attr("r", "2px")
		        .attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
		        .attr("cy", function (d) { return projection(d)[1]; });

        var zoom = d3.zoom()
            .scaleExtent([0.9, 4])
            .translateExtent([[-100, -100], [width + 100, height + 100]])
            .on("zoom", function() {
                g.attr("transform", d3.event.transform);
            });
        svg.call(zoom);

        function clicked(d) {
            if (active.node() === this) {
                reset();
                return;
            }
            active.classed("active", false);
            active = d3.select(this).classed("active", true);

            var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
                tx = width / 2 - scale * x,
                ty = height / 2 - scale * y;

            var transform = d3.zoomIdentity.translate(tx, ty).scale(scale);
            svg.transition().duration(750)
                .call(zoom.transform, transform);

            g.selectAll("circle").attr("r", "1px");
            return;
        }

        function reset() {
            active.classed("active", false);
            active = d3.select(null);

            svg.transition().duration(750)
                .call(zoom.transform, d3.zoomIdentity);

            g.selectAll("circle").transition().duration(750).attr("r", "2px");
        }
    }
);

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
