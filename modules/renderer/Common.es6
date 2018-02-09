// The fuck line
export default function(thefuck) {
  const svg = this;
  const SVG_WIDTH = svg.attr("width");
  const SVG_HEIGHT = svg.attr("height");
  const MARGIN = 20;

  // Draw background
  svg.append("rect").classed("bg", true)
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("width", "100%")
    .attr("height", "100%");

  // Draw graph title
  if (thefuck.settings !== undefined && thefuck.settings.title !== undefined) {
    svg.append("text")
      .classed("title", true)
      .attr("x", SVG_WIDTH / 2)
      .attr("y", SVG_HEIGHT - MARGIN)
      .text(thefuck.settings.title);
  }
}
