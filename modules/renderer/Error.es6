export default function(thefuck) {
  const svg = this;
  const MSG_H = 25;

  let msgCount = 1;
  if (typeof thefuck.settings.message !== "string") {
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
  if (typeof thefuck.settings.message === "string") {
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
}
