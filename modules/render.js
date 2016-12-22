(function() {
  // The fuck timelime
  d3.selection.prototype.theFuckTimeline = function(thefuck) {
    var svg  = this;

    // Data validation
    // TODO

    var AVAILABLE_SCALE = [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10];

    var min = 9999;
    var max = -9999;
    for (i in thefuck.lines) {
      if (thefuck.lines[i].from < min) {
        min = thefuck.lines[i].from;
      }
      if (thefuck.lines[i].to > max) {
        max = thefuck.lines[i].to;
      }
    }
    var mid = (max+min) / 2;
    
    var range = max - min;
    var ratio = (svg.attr("width")-40) / range;

    var i;
    for (i in AVAILABLE_SCALE) {
      var ac = parseInt(range / AVAILABLE_SCALE[i]);
      if (ac < 5) {
        scale = AVAILABLE_SCALE[i];
      }
    }
    var axisPositions = [];
    var minP = Math.ceil(min/scale);
    var maxP = Math.floor(max/scale);
    while (minP <= maxP) {
      axisPositions.push(scale * minP);
      minP++;
    }
    console.log(axisPositions);

    var posXFomula = function(d) {
      return parseInt((d - min) * ratio + 20);
    };
    var posYFomula = function(d, i) {
      return i * 45 + 40;
    };
    var barXFomula = function(d) {
      return posXFomula(d.from);
    };
    var barYFomula = function(d, i) {
      return i * 45 + 40;
    };
    var barWFomula = function(d, i) {
      return parseInt((d.to - d.from) * ratio);
    };
    var axisXFormula = function(d, i) {
      return parseInt((d - min) * ratio + 20);
    };
    var axisTitleXFormula = function(d, i) {
      return axisXFormula(d, i) + 5;
    };
    var titleXFormula = function(d) {
      var left = ((d.from + d.to)/2 < mid);
      return left ?
        posXFomula(d.from) + 10 :
        posXFomula(d.to) - 10;
    };
    var titleYFormula = function(d, i) {
      return posYFomula(d, i) + 15;
    };
    var titleAnchorFormula = function(d) {
      var left = ((d.from + d.to)/2 < mid);
      return left ? "begin" : "end";
    };
    var titleXFomula = function(d, i) {
      return 300;
    };
    var titleYFomula = function(d, i) {
      return barYFomula(d, i) + 15;
    };
    var titleTextFomula = function(d, i) {
      var p1 = (d.from < 0) ? "BC" : "AD";
      var p2 = (d.to < 0) ? "BC" : "AD";
      var y1 = Math.abs(d.from);
      var y2 = Math.abs(d.to);
      return d.title + " (" + p1 + " " + y1 + " ~ " + p2 + " " + y2 + ")";
    };

    // Mark class for styling
    svg.classed("rtf-timeline", true);
    svg.classed("rtf-theme-default", true);

    // Draw background
    svg.append("rect").classed("bg", true).attr({
      "x": 0,
      "y": 0,
      "width": "100%",
      "height": "100%"
    });

    // Draw base bar
    svg.append("g").classed("bars-base", true).selectAll("rect").data(thefuck.lines).enter()
      .append("rect").attr({
        "x": 20,
        "y": barYFomula,
        "width": svg.attr("width")-40,
        "height": 30
      });

    // Draw bar
    svg.append("g").classed("bars", true).selectAll("rect").data(thefuck.lines).enter()
      .append("rect").attr({
        "x": barXFomula,
        "y": barYFomula,
        "width": barWFomula,
        "height": 30
      });

    // Draw axis
    svg.append("g").classed("axes", true).selectAll("line").data(axisPositions).enter()
      .append("line").attr({
        "x1": axisXFormula,
        "y1": 20,
        "x2": axisXFormula,
        "y2": svg.attr("height") - 70
      });

    // Draw axis title
    svg.append("g").classed("axes-title", true).selectAll("text").data(axisPositions).enter()
      .append("text").attr({
        "x": axisXFormula,
        "y": svg.attr("height") - 65
      }).text(function(d) { return d; });

    // Draw bar title
    svg.append("g").classed("bars-title", true).selectAll("text").data(thefuck.lines).enter()
      .append("text")
      .attr({
        "x": titleXFormula,
        "y": titleYFormula,
        "text-anchor": titleAnchorFormula
      })
      .text(titleTextFomula);

    // Draw graph title
    svg.append("text")
      .classed("title", true)
      .attr({
        "x": svg.attr("width") / 2,
        "y": svg.attr("height") - 20
      })
      .text(thefuck.properties.title);
  };

  d3.selection.prototype.theFuckError = function(thefuck) {
    var svg = this;

    svg.attr("height", 50);
    svg.select("defs").remove();

    svg.classed("rtf-error", true);
    svg.classed("rtf-theme-default", true);

    // Draw background
    svg.append("rect").classed("bg", true).attr({
      "x": 0,
      "y": 0,
      "width": "100%",
      "height": "100%",
      "fill": "#f07070"
    });

    // Draw error message
    svg.append("text")
      .attr({
        "x": svg.attr("width") / 2,
        "y": svg.attr("height") / 2,
        "text-anchor": "middle",
        "font-size": "1.2em",
        "fill": "#a00000"
      })
      .text(thefuck.properties.message);
  };

  // Load data
  d3.selectAll(".render-the-fuck").each(function() {
    var id = d3.select(this).attr("id");
    var thefuck = window.RENDER_THE_FUCK[id];

    // Common settings
    d3.select(this).attr("style", "border: 1px solid #ddd; border-radius: 8px;");

    // Bind and Render
    switch (thefuck.wtf) {
      case 'timeline':
        d3.select(this).theFuckTimeline(thefuck);
        break;
      case 'error':
        d3.select(this).theFuckError(thefuck);
        break;
      default:
        d3.select(this).theFuckError({
          "wtf": "error",
          "properties": {
            "message": "Unrecognize what the fuck."
          }
        });
    }
  });
}());