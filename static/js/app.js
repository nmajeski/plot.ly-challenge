var barSampleValues = [];
var barOtuIds = [];
var barOtuLabels = [];
var bubbleSampleValues = [];
var bubbleOtuIds = [];
var bubbleOtuLabels = [];
var samples;
var metadata;

function init() {
    d3.json("samples.json").then((importedData) => {
        var names = importedData.names;
        samples = importedData.samples;
        metadata = importedData.metadata;

        var select = d3.select('select');
        select.selectAll('option').data(names).enter().append('option').text(function (name) { return name; });

        var firstSample = samples[0];
        
        // bar
        barSampleValues = firstSample.sample_values.slice(0, 10).reverse();
        barOtuIds = firstSample.otu_ids.slice(0, 10).reverse().map(id => "OTU " + id);
        barOtuLabels = firstSample.otu_labels.slice(0, 10).reverse();

        var trace1 = {
            x: barSampleValues,
            y: barOtuIds,
            text: barOtuLabels,
            name: 'OTUs',
            type: 'bar',
            orientation: 'h'
        };
        var chartData = [trace1];
        var layout = {
            margin: {
                l: 100,
                r: 100,
                t: 0,
                b: 20
            }
        };
        Plotly.newPlot('bar', chartData, layout);

        // bubble
        bubbleSampleValues = firstSample.sample_values;
        bubbleOtuIds = firstSample.otu_ids;
        bubbleOtuLabels = firstSample.otu_labels;

        trace1 = {
            x: bubbleOtuIds,
            y: bubbleSampleValues,
            text: bubbleOtuLabels,
            mode: 'markers',
            marker: {
                color: bubbleOtuIds,
                size: bubbleSampleValues
            }
        };
        chartData = [trace1];
        layout = {
            xaxis: {
                title: {
                    text: 'OTU ID'
                }
            }
        };
        Plotly.newPlot('bubble', chartData, layout);

        // demographics
        var firstMetadata = metadata[0];
        var sampleMetadata = d3.select('#sample-metadata');
        Object.entries(firstMetadata).forEach( ([key, value]) => {
            sampleMetadata.append('p').text(key + ": " + value);
        });
    });
};

function optionChanged(newOption) {
    var dropdownMenu = d3.select("#selDataset");
    var subjectId = dropdownMenu.property("value");
    
    var selectedSample = samples.find(sample => sample.id === subjectId);
    barSampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    barOtuIds = selectedSample.otu_ids.slice(0, 10).reverse().map(id => "OTU " + id);
    barOtuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

    Plotly.restyle("bar", "x", [barSampleValues]);
    Plotly.restyle("bar", "y", [barOtuIds]);
    Plotly.restyle("bar", "text", [barOtuLabels]);

    bubbleSampleValues = selectedSample.sample_values;
    bubbleOtuIds = selectedSample.otu_ids;
    bubbleOtuLabels = selectedSample.otu_labels;

    Plotly.restyle("bubble", "x", [bubbleSampleValues]);
    Plotly.restyle("bubble", "y", [bubbleOtuIds]);
    Plotly.restyle("bubble", "text", [bubbleOtuLabels]);
    Plotly.restyle("bubble", "marker.color", [bubbleOtuIds]);
    Plotly.restyle("bubble", "marker.size", [bubbleSampleValues]);

    var sampleMetadata = d3.select('#sample-metadata');
    var selectedSampleMetadata = metadata.find( datum => (datum.id + "") === subjectId);
    sampleMetadata.selectAll('p').remove();
    Object.entries(selectedSampleMetadata).forEach( ([key, value]) => {
        sampleMetadata.append('p').text(key + ": " + value);
    });
}

init();
