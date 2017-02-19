var svg = d3.select("svg");
var margin = {top: 40, right: 10, bottom: 20, left: 10};
var width = svg.attr("width") - margin.left - margin.right;
var height = svg.attr("height") - margin.top - margin.bottom;
var format = d3.format(",d");
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function translateProvince(key) {
    var translations = {
        "alberta": "AB",
        "british-columbia": "BC",
        "manitoba": "MB",
        "new-brunswick": "NB",
        "newfoundland-and-labrador": "NL",
        "nova-scotia": "NS",
        "northwest-territories": "NT",
        "nunavut": "NU",
        "ontario": "ON",
        "prince-edward-island": "PE",
        "quebec": "QC",
        "saskatchewan": "SK",
        "yukon-territory": "YT"
    };
    return translations[key];
}

d3.csv(
    "https://raw.githubusercontent.com/monctonug/mug-hacknight-1/master/open-data/canadian-protected-areas/Canadian-Protected-Areas.tbl.csv",
    function(row) {
        return {
            province: _.kebabCase(row.ProvinceTerritory),
            biome: _.kebabCase(row.Biome_En),
            size: 1
        };
    },
    function(error, areas) {
        if (error) throw error;

        var provinces = _.groupBy(areas, "province");
        var provinceKeys = _.chain(provinces).keys().sort().value();
        var biomes = _.chain(areas).map("biome").uniq().sort().value();

        var yRange = d3.range(biomes.length);
        var xRange = d3.range(provinceKeys.length);

        var seriesData = _.map(biomes, function(biome) {
            return _.map(provinceKeys, function(province) {
                var provinceBiomes = _.groupBy(provinces[province], "biome");
                var values = provinceBiomes[biome];
                return (values) ? values.length : 0;
            });
        });

        var maxStacked = _.chain(provinces).map("length").max().value();
        var maxGrouped = _.chain(provinces).map(function(items) {
            return _.chain(items).groupBy("biome").map("length").max().value();
        }).max().value();

        var x = d3.scaleBand()
            .domain(xRange)
            .rangeRound([0, width])
            .padding(0.08);

        var y = d3.scaleLinear()
            .domain([0, maxStacked])
            .range([height, 0]);

        var color = d3.scaleOrdinal()
            .domain(xRange)
            .range(d3.schemeCategory20c);

        var series = g.selectAll(".series")
            .data(d3.stack().keys(yRange)(d3.transpose(seriesData)))
            .enter().append("g")
            .attr("fill", function(d, i) { return color(i); });

        var rect = series.selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d, i) { return x(i); })
            .attr("y", height)
            .attr("width", x.bandwidth())
            .attr("height", 0);

        rect.append("title")
            .text(function(d, i) {
                var yValues = _.map(d.data, function(yValue, yIndex) {
                    return biomes[yIndex] + ": " + format(yValue);
                });
                return provinceKeys[i] + "\n\n" + yValues.join("\n");
            });

        rect.transition()
            .delay(function(d, i) { return i * 25; })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); });

        var axisBottom = d3.axisBottom(x)
            .tickSize(0)
            .tickPadding(6)
            .tickFormat(function(i) { return translateProvince(provinceKeys[i]); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(axisBottom);

        d3.selectAll("input").on("change", function() {
            if (this.value === "grouped") transitionGrouped();
            else transitionStacked();
        });

        function transitionGrouped() {
            y.domain([0, maxGrouped]);

            rect.transition()
                .duration(500)
                .delay(function(d, i) { return i * 10; })
                .attr("x", function(d, i) { return x(i) + x.bandwidth() / biomes.length * this.parentNode.__data__.key; })
                .attr("width", x.bandwidth() / biomes.length)
                .transition()
                .attr("y", function(d) { return y(d[1] - d[0]); })
                .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
        }

        function transitionStacked() {
            y.domain([0, maxStacked]);

            rect.transition()
                .duration(500)
                .delay(function(d, i) { return i * 10; })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .transition()
                .attr("x", function(d, i) { return x(i); })
                .attr("width", x.bandwidth());
        }
    }
);
