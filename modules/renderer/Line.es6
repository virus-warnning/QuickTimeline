// The fuck line
export default function(d3, thefuck, WTF_PARAMS) {
  const svg = this;
  svg.classed("rtf-line", true);

  // Chart Area
  // x1 =  x + margin = ax + cy + e
  // y1 = -y + (bottom - margin * 3) = bx + dy + f
  // a = 1, c = 0, e = margin
  // b = 0, d = -1, f = bottom - margin * 3
  const chartMatrix = "matrix(1 0 0 -1 {E} {F})"
    .replace("{E}", WTF_PARAMS.margin)
    .replace("{F}", svg.attr("height") - WTF_PARAMS.margin * 3);
  const chart = svg.append("g").classed("chart", true)
    .attr("transform", chartMatrix);

  // Background
  const chartWidth = svg.attr("width") - WTF_PARAMS.margin * 4;
  const chartHeight = svg.attr("height") - WTF_PARAMS.margin * 4;
  chart.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", chartWidth)
    .attr("height", chartHeight);

  // Axises
  const axisPath = d3.path();
  axisPath.moveTo(0, chartHeight);
  axisPath.lineTo(0, 0);
  axisPath.lineTo(chartWidth, 0);
  chart.append("path").classed("axis", true)
    .attr("d", axisPath.toString());

  // Get min/max value
  const extremeValues = thefuck.lines.map((line) => {
    const lineValues = line.data.map((item) => {
      return item.value;
    });
    return {
      min: Math.min.apply(null, lineValues),
      max: Math.max.apply(null, lineValues)
    };
  });
  const min = Math.min.apply(null, extremeValues.map((item) => { return item.min; }));
  const max = Math.max.apply(null, extremeValues.map((item) => { return item.max; }));

  // Get lBound, uBound
  const dist = max - min;
  const scaleExp = Math.floor(Math.log10(dist)-1);
  let scaleBase = 1;
  for (let b of [2, 5]) {
    if (10 * b * Math.pow(10, scaleExp) < dist) {
      scaleBase = b;
    }
  }
  const scale = scaleBase * Math.pow(10, scaleExp);
  const lBound = Math.floor(min / scale - 1) * scale;
  const uBound = Math.ceil(max / scale + 1) * scale;

  // Draw lines
  const xRatio = chartWidth / thefuck.lines[0].data.length;
  const yRatio = chartHeight / (uBound - lBound);
  const pathFunction = d3.line()
    .x(function(d, i) { return Math.floor(i * xRatio); })
    .y(function(d) { return Math.floor((d.value - lBound) * yRatio); });
  chart.selectAll("path.line").data(thefuck.lines).enter()
    .append("path").classed("line", true)
    .attr("d", function(d) { return pathFunction(d.data); });
}
