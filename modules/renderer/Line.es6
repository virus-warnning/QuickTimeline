// The fuck line
export default function(thefuck) {
  const svg = this;
  const MARGIN = 20;

  svg.classed("rtf-line", true);

  // Get min/max value
  const values = thefuck.lines[0].data.map((item) => {
    return item.value;
  });
  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);
  console.log(min, max);

  const top = MARGIN;
  const bottom = svg.attr("height") - MARGIN * 2.5;
  const left = MARGIN;
  const right = svg.attr("width") - MARGIN * 3;
  svg.append("line")
    .attr("x1", left)
    .attr("y1", top)
    .attr("x2", right)
    .attr("y2", top);
  svg.append("line")
    .attr("x1", left)
    .attr("y1", bottom)
    .attr("x2", right)
    .attr("y2", bottom);
}
