// The fuck stack
export default function(thefuck) {
  const svg = this;

  /*
  var level = 0;
  var parents = [
    [{ from: 20, width: svg.attr("width")-40 }],
  ];

  const itemXFormula = function(d, i) {
    const pidx = d.parent || 0;
    const parent = parents[pidx];

    return 10;
  };
  const itemYFormula = function(d, i) {
    return svg.attr("height") - 50 - (level * 40);
  };
  const itemWFormula = function(d, i) {
    return 200;
  };
  const itemHFormula = function(d, i) {
    return 30;
  };
  */

  svg.classed("rtf-stack", true);
  svg.classed("rtf-theme-default", true);

  // Draw background
  svg.append("rect").classed("bg", true)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#f07070");

  // Draw stack items
  svg.data(["A"]).enter().append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 200)
    .attr("height", 30)
    .attr("fill", "#ff0000");

  // var parents = [];

  // Draw graph title
  svg.append("text")
    .classed("title", true)
    .attr("x", svg.attr("width")/2)
    .attr("y", svg.attr("height")-20)
    .text(thefuck.settings.title);
}
