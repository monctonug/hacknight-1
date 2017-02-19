var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

var g = svg.append("g")
    .attr("class", "background");

svg.on("click", stopped, true);

d3.json(
    "https://raw.githubusercontent.com/mdgnkm/SIG-Map/master/canada.json",
    function(canada) {
        var active = d3.select(null);

        var projection = d3.geoAlbers()
            .fitSize([width, height], canada);

        var path = d3.geoPath(projection);

        var provinces = g.selectAll("path")
            .data(canada.features)
            .enter()
            .append("path")
            .attr("class", "feature")
            .attr("d", path)
            .on("click", clicked);

        var zoom = d3.zoom()
            .scaleExtent([1, 4])
            .translateExtent([[-100, -100], [width + 100, height + 100]])
            .on("zoom", function() {
                g.attr("transform", d3.event.transform);
            });
        svg.call(zoom);

        function clicked(d) {
            if (active.node() === this) return reset();
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
        }

        function reset() {
            active.classed("active", false);
            active = d3.select(null);

            svg.transition().duration(750)
                .call(zoom.transform, d3.zoomIdentity);
        }

    }
);

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
