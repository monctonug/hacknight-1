var svg = d3.select("svg");
var margin = {top: 40, right: 10, bottom: 20, left: 10};
var width = svg.attr("width") - margin.left - margin.right;
var height = svg.attr("height") - margin.top - margin.bottom;
var format = d3.format(",d");
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(
    "Canadian-Protected-Areas.tbl.csv",
    function(row) {
        return {
            province: _.kebabCase(row.ProvinceTerritory),
            biome: _.kebabCase(row.Biome_En),
            size: 1
        };
    },
    function(error, areas) {
        if (error) throw error;

        // X axis: number of value per series
        var provinces = _.groupBy(areas, "province");
        var provinceKeys = _.chain(provinces).keys().sort().value();

        // Y axies: number of series
        var biomes = _.chain(areas).map("biome").uniq().sort().value();

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
            .domain(d3.range(provinceKeys.length))
            .rangeRound([0, width])
            .padding(0.08);

        var y = d3.scaleLinear()
            .domain([0, maxStacked])
            .range([height, 0]);

        var color = d3.scaleOrdinal()
            .domain(d3.range(provinceKeys.length))
            .range(d3.schemeCategory20c);

        var series = g.selectAll(".series")
            .data(d3.stack().keys(d3.range(biomes.length))(d3.transpose(seriesData)))
            .enter().append("g")
            .attr("fill", function(d, i) { return color(i); });

        var rect = series.selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d, i) { return x(i); })
            .attr("y", height)
            .attr("width", x.bandwidth())
            .attr("height", 0);

        rect.transition()
            .delay(function(d, i) { return i * 10; })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                  .tickSize(0)
                  .tickPadding(6));

        d3.selectAll("input")
            .on("change", changed);

        function changed() {
            if (this.value === "grouped") transitionGrouped();
            else transitionStacked();
        }

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
