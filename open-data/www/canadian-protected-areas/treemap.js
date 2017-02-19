var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");
var format = d3.format(",d");

var color = d3.scaleOrdinal(d3.schemeCategory10);

var g = svg.append("g").attr("transform", "translate(2,2)");

var treemap = d3.treemap()
    .size([width, height])
    .paddingOuter(3)
    .paddingTop(19)
    .paddingInner(1)
    .round(true);

function id(...parts) {
    return parts.join(".");
}

function parentId(id) {
    return id.substring(0, id.lastIndexOf("."));
}

function name(id) {
    return id.substring(id.lastIndexOf(".") + 1);
}

function datum(size, id) {
    return {
        id: id,
        parentId: parentId(id),
        size: size,
        name: name(id)
    };
}

function stratify(areas) {
    let data = [];

    _.chain(areas)
        .groupBy(function(area) {
            return id("canada", area.province, area.biome);
        })
        .mapValues("length")
        .each(function(size, id) {
            data.push(datum(size, id));

            // Add missing parents
            data.push(datum(0, parentId(id)));
            data.push(datum(0, parentId(parentId(id))));
        })
        .value();

    data = _.uniqBy(data, "id");

    return d3.stratify()(data);
}

d3.csv(
    "Canadian-Protected-Areas.tbl.csv",
    function(row) {
        return {
            country: "Canada",
            province: _.kebabCase(row.ProvinceTerritory),
            biome: _.kebabCase(row.Biome_En),
            size: 1
        };
    },
    function(error, areas) {
        if (error) throw error;

        var root = stratify(areas)
            .sum(function(d) { return d.size; })
            .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

        treemap(root);

        var cell = svg
            .selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
            .attr("class", "node")
            .each(function(d) { d.node = this; })
            .on("mouseover", hovered(true))
            .on("mouseout", hovered(false));

        cell.append("rect")
            .attr("id", function(d) { return "rect-" + d.data.id; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .style("fill", function(d) { return color(d.depth); });

        cell.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.data.id; })
            .append("use")
            .attr("xlink:href", function(d) { return "#rect-" + d.data.id + ""; });

        var label = cell.append("text")
            .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; });

        label.selectAll("tspan")
            .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g).concat("\xa0" + format(d.value)); })
            .enter().append("tspan")
            .attr("x", function(d, i) { return i ? null : 4; })
            .attr("y", 13)
            .text(function(d) { return d; });

        cell.append("title")
            .text(function(d) { return d.data.name + "\n" + format(d.value); });

    }
);

function hovered(hover) {
    return function(d) {
        d3.selectAll(d.ancestors().map(function(d) { return d.node; }))
          .classed("node--hover", hover)
          .select("rect")
          .attr("width", function(d) { return d.x1 - d.x0 - hover; })
          .attr("height", function(d) { return d.y1 - d.y0 - hover; });
  };
}
