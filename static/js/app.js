function init() {
  var selector = d3.select("#selDataset");


  d3.json("samples.json").then((data) => {
    var samples = data.names;

    samples.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    var firstSample = samples[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

init();

function optionChanged(chart) {
  buildMetadata(chart);
  buildCharts(chart);
  
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var  ids = result.otu_ids;
    var labels = result.otu_labels.slice(0, 10).reverse();
    var values = result.sample_values.slice(0,10).reverse();
    var bubbleLabels = result.otu_labels;
    var bubbleValues = result.sample_values;
    var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
    console.log(yticks)
    var barData = [{
      x: values,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: labels 
    }];
    var barLayout = {
     title: "10 Most Common Bacteria"
    };
     Plotly.newPlot("bar", barData, barLayout);

    var bubbleData = [{
      x: ids,
      y: bubbleValues,
      text: bubbleLabels,
      mode: "markers",
       marker: {
         size: bubbleValues,
         color: bubbleValues,
         colorscale: "Portland" 
       }
    }];
    var bubbleChart = {
        title: "Bacteria Amount per sample",
        xaxis: {title: "OTU ID"},
        automargin: true,
        hovermode: "closest"
    };
    Plotly.newPlot("bubble", bubbleData, bubbleChart)

    var metadata = data.metadata;
    var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);  
        var gaugeResult = gaugeArray[0];
    var wfreqs = gaugeResult.wfreq;
    console.log(wfreqs)
    var gaugeData = [{
      value: wfreqs,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>Washing Frequency </b> <br></br>Weekly Wash"},
      gauge: {
        axis: {range: [null,10], dtick: "2"},

        bar: {color: "black"},
        steps:[
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
        dtick: 2
      }
    }];
    var gaugeLayout = { 
     automargin: true
    };
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}