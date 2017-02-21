# Open Data

This project consists of making [D3.js](https://d3js.org/) visualization of [Open Data](http://open.canada.ca/en/open-data)) made available by the Government of Canada.

## Getting Started

There are sample visualization in the subdirectories. It should be as simple as opening one of the HTML file from the subdirectories in your browser to get started. Rendered examples can be seen on GitHub here:

* [Bars: Protected Areas - Canada](https://monctonug.github.io/mug-hacknight-1/open-data/canadian-protected-areas/bars.html)
* [Treemap: Protected Areas - Canada](https://monctonug.github.io/mug-hacknight-1/open-data/canadian-protected-areas/treemap.html)
* [Circle Packing: Protected Areas - Canada](https://monctonug.github.io/mug-hacknight-1/open-data/canadian-protected-areas/circlepack.html)
* [Map: Capitals - Canada](https://monctonug.github.io/mug-hacknight-1/open-data/capital-map/map.html)

The CSV/JSON is loaded from sources hosted on GitHub. This is to work around cross origin request issues when requesting the files directly from open.canada.ca or from disk.

It may be easier to have access to a CSV file directly. To make this this possible, you have to make the files in this directory available through a web server. If you have python installed, an easy way to get started is to run the following command from this directory:

```
python -m SimpleHTTPServer 8000
```

You can then access documents by navigating to http://localhost:8000/ in your browser.


## Resources

Open Data

* [Home Page](http://open.canada.ca/en/open-data)
* [Working with Data and Application Programming Interfaces](http://open.canada.ca/en/working-data)
* [List of Datasets](http://open.canada.ca/data/en/dataset)

D3.js

* [D3.js](https://d3js.org/)
* [D3.js Gallery](https://github.com/d3/d3/wiki/Gallery)
* [D3.js Tutorials](https://github.com/d3/d3/wiki/Tutorials)
* [D3.js API Reference](https://github.com/d3/d3/blob/master/API.md)

Presentations

* https://maptimeboston.github.io/d3-maptime/
