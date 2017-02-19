# Open Data

This project consists of making [D3.js](https://d3js.org/) visualization of [Open Data](http://open.canada.ca/en/open-data)) made available by the Government of Canada.

There are three examples in the `canadian-protected-areas` directory. They show different ways of visualizing [Protected Areas](http://open.canada.ca/data/en/dataset/6c343726-1e92-451a-876a-76e17d398a1c) by province / biomes.

## Getting Started

It should be as simple as opening one of the HTML files from the `canadian-protected-areas` directory in your browser.

The CSV is loaded from GitHub. This is to get around cross origin request issues when requesting the CSV directly from open.canada.ca or from a file on disk.

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
