// Don't use import statement in script mode
const d3 = require('d3');
const validate = require('jsonschema').validate;
const schema = require('../schemas/timeline.schema.json');

// The fuck timelime
d3.selection.prototype.theFuckTimeline = function(thefuck) {
  const svg = this;
  const AVAILABLE_SCALE = [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10];

  let min = 9999;
  let max = -9999;
  for (const line of thefuck.lines) {
    if (line.from < min) {
      min = line.from;
    }
    if (line.to > max) {
      max = line.to;
    }
  }
  const mid = (max+min) / 2;
  
  const range = max - min;
  const ratio = (svg.attr("width")-40) / range;
  let scale = 0;

  for (const s of AVAILABLE_SCALE) {
    const ac = parseInt(range / s);
    if (ac < 5) {
      scale = s;
    }
  }
  const axisPositions = [];
  let minP = Math.ceil(min/scale);
  let maxP = Math.floor(max/scale);
  while (minP <= maxP) {
    axisPositions.push(scale * minP);
    minP++;
  }

  const posXFormula = (d) => {
    return parseInt((d - min) * ratio + 20);
  };
  const posYFormula = (d, i) => {
    return i * 45 + 40;
  };
  const barXFormula = (d) => {
    return posXFormula(d.from);
  };
  const barYFormula = (d, i) => {
    return i * 45 + 40;
  };
  const barWFormula = (d) => {
    return parseInt((d.to - d.from) * ratio);
  };
  const axisXFormula = (d) => {
    return parseInt((d - min) * ratio + 20);
  };
  const titleXFormula = (d) => {
    const left = ((d.from + d.to)/2 < mid);
    return left ?
      posXFormula(d.from) + 10 :
      posXFormula(d.to) - 10;
  };
  const titleYFormula = (d, i) => {
    return posYFormula(d, i) + 15;
  };
  const titleAnchorFormula = (d) => {
    const left = ((d.from + d.to)/2 < mid);
    return left ? "begin" : "end";
  };
  const titleTextFormula = (d) => {
    if (typeof d.wiki === "string" && d.wiki !== "") return "";
    const p1 = (d.from < 0) ? "BC" : "AD";
    const p2 = (d.to < 0) ? "BC" : "AD";
    const y1 = Math.abs(d.from);
    const y2 = Math.abs(d.to);
    return d.title + " (" + p1 + " " + y1 + " ~ " + p2 + " " + y2 + ")";
  };
  const titleWikiFormula = (d) => {
    if (typeof d.wiki !== "string" || d.wiki === "") return "";
    const p1 = (d.from < 0) ? "BC" : "AD";
    const p2 = (d.to < 0) ? "BC" : "AD";
    const y1 = Math.abs(d.from);
    const y2 = Math.abs(d.to);
    return d.title + " (" + p1 + " " + y1 + " ~ " + p2 + " " + y2 + ")";
  };

  // Mark class for styling
  svg.classed("rtf-timeline", true);
  svg.classed("rtf-theme-default", true);

  // Draw background
  svg.append("rect").classed("bg", true)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", "100%")
    .attr("height", "100%");

  // Draw base bar
  svg.append("g").classed("bars-base", true).selectAll("rect").data(thefuck.lines).enter()
    .append("rect")
    .attr("x", 20)
    .attr("y", barYFormula)
    .attr("width", svg.attr("width")-40)
    .attr("height", 30);

  // Draw bar
  svg.append("g").classed("bars", true).selectAll("rect").data(thefuck.lines).enter()
    .append("rect")
    .attr("x", barXFormula)
    .attr("y", barYFormula)
    .attr("width", barWFormula)
    .attr("height", 30);

  // Draw axis
  svg.append("g").classed("axes", true).selectAll("line").data(axisPositions).enter()
    .append("line")
    .attr("x1", axisXFormula)
    .attr("y1", 20)
    .attr("x2", axisXFormula)
    .attr("y2", svg.attr("height")-70);

  // Draw axis title
  svg.append("g").classed("axes-title", true).selectAll("text").data(axisPositions).enter()
    .append("text")
    .attr("x", axisXFormula)
    .attr("y", svg.attr("height") - 65)
    .text(function(d) { return d; });

  // Draw bar title
  svg.append("g").classed("bars-title", true).selectAll("text").data(thefuck.lines).enter()
    .append("text")
    .attr("x", titleXFormula)
    .attr("y", titleYFormula)
    .attr("anchor", titleAnchorFormula)
    .text(titleTextFormula);

  // Draw bar linked title
  svg.select("g.bars-title").selectAll("a").data(thefuck.lines).enter()
    .append("a")
    .attr("xlink:href", function(d) { return "https://en.wikipedia.org/wiki/" + d.wiki; })
    .attr("target", "_blank")
    .append("text")
    .attr("x", titleXFormula)
    .attr("y", titleYFormula)
    .attr("text-anchor", titleAnchorFormula)
    .text(titleWikiFormula);

  // Draw graph title
  svg.append("text")
    .classed("title", true)
    .attr("x", svg.attr("width")/2)
    .attr("y", svg.attr("height")-20)
    .text(thefuck.settings.title);

  // Draw download link
  const ftid  = svg.attr("id") + "-footer";
  const style = THE_FUCK_STYLES["timeline"];
  const body  = svg.html().replace("<defs></defs>", "<defs><style type=\"text/css\">" + style + "</style></defs>");
  const blob  = new Blob(
    [
      "<?xml version=\"1.0\"?>",
      "<svg xmlns=\"http://www.w3.org/2000/svg\">",
      body,
      "</svg>"
    ],
    {"type": "image/xml+svg"}
  );
  const link = window.URL.createObjectURL(blob);

  d3.select("#"+ftid).append("a")
    .attr("href", link)
    .attr("download", svg.attr("id") + ".svg")
    .text("Download");
};

d3.selection.prototype.theFuckError = function(thefuck) {
  const svg = this;
  const MSG_H = 25;

  let msgCount = 1;
  if (typeof thefuck.settings.message !== 'string') {
    msgCount = thefuck.settings.message.length;
  }
  const h = MSG_H * (msgCount + 0.6);

  svg.attr("height", h);
  svg.select("defs").remove();

  svg.classed("rtf-error", true);
  svg.classed("rtf-theme-default", true);

  // Draw background
  svg.append("rect").classed("bg", true)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#f07070");

  // Draw error message
  let messages = thefuck.settings.message;
  if (typeof thefuck.settings.message === 'string') {
    messages = [thefuck.settings.message];
  }
  svg.selectAll("text").data(messages).enter()
    .append("text")
    .attr("x", svg.attr("width") / 2)
    .attr("y", function(d, i) { return (i + 1) * MSG_H; })
    .attr("text-anchor", "middle")
    .attr("font-size", "1.2em")
    .attr("fill", "#a00000")
    .text(function(d) { return d; });
};

// Load data
d3.selectAll(".render-the-fuck").each(function() {
  const id = d3.select(this).attr("id");
  const thefuck = window.RENDER_THE_FUCK[id];

  // Common settings
  d3.select(this).attr("style", "border: 1px solid #ddd; border-radius: 8px;");

  // To save validation errors.
  let vdErrors = [];

  // Bind and Render
  switch (thefuck.wtf) {
    case "timeline":
      vdErrors = validate(thefuck, schema).errors;
      if (vdErrors.length === 0) {
        d3.select(this).theFuckTimeline(thefuck);
      }
      break;
    // An error occured at back-end.
    case "error":
      d3.select(this).theFuckError(thefuck);
      break;
    // Unrecognize what the fuck.
    default:
      d3.select(this).theFuckError({
        "wtf": "error",
        "settings": {
          "message": "Unrecognize what the fuck."
        }
      });
  }

  // Display validation errors.
  if (vdErrors.length > 0) {
    const vdMsg = [];
    for (const err of vdErrors) {
      const n = err.property;
      vdMsg.push(n.charAt(0).toUpperCase() + n.slice(1) + ' ' + err.message);
    }
    d3.select(this).theFuckError({
      "wtf": "error",
      "settings": {
        "message": vdMsg
      }
    });
  }
});