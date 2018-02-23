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
  const chartBg = chart.append("rect")
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
    return {
      min: Math.min.apply(null, line.data),
      max: Math.max.apply(null, line.data)
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
  const xRatio = chartWidth / thefuck.labels.length;
  const yRatio = chartHeight / (uBound - lBound);
  const pathFunction = d3.line()
    .x(function(d, i) { return Math.floor(i * xRatio); })
    .y(function(d) { return Math.floor((d - lBound) * yRatio); });
  const lineGroup = chart.append("g").classed("line", true);
  lineGroup.selectAll("path").data(thefuck.lines).enter()
    .append("path")
    .attr("d", function(d) { return pathFunction(d.data); });

  // Draw Focused Position
  const focusedPosition = chart.append("g").classed("focusedPosition", true)
    .attr("visibility", "hidden");
  const focusedAxis = focusedPosition.append("line").classed("focusedAxis", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", chartHeight);
  const focusedPointGroup = focusedPosition.append("g").classed("focusedPoint", true);
  focusedPointGroup.selectAll("circle").data(thefuck.lines).enter()
    .append("circle")
    .attr("r", 4);
  const focusedValueBorderGroup = focusedPosition.append("g").classed("focusedValueBorder", true)
    .attr("transform", "matrix(1 0 0 1 15 -12)");
  focusedValueBorderGroup.selectAll("rect").data(thefuck.lines).enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 8)
    .attr("ry", 8)
    .attr("width", 50)
    .attr("height", 25);
  const focusedValueGroup = focusedPosition.append("g").classed("focusedValue", true)
    .attr("transform", "matrix(1 0 0 -1 25 -1)");
  focusedValueGroup.selectAll("text").data(thefuck.lines).enter()
    .append("text");
  const popFocusedAxis = function() {
    const index = Math.round((event.offsetX - WTF_PARAMS.margin) / xRatio);
    if (index >= 0 && index < thefuck.lines[0].data.length) {
      const focusedAxisX = Math.floor(index * xRatio);
      const valueToY = function(d) { return Math.floor((d - lBound) * yRatio); };
      const values = thefuck.lines.map((line) => {
        return line.data[index];
      });

      focusedAxis
        .attr("x1", focusedAxisX)
        .attr("x2", focusedAxisX);

      focusedPointGroup.selectAll("circle").data(values)
        .attr("cx", focusedAxisX)
        .attr("cy", valueToY);

      focusedValueBorderGroup.selectAll("rect").data(values)
        .attr("x", focusedAxisX)
        .attr("y", valueToY);

      focusedValueGroup.selectAll("text").data(values)
        .attr("x", focusedAxisX)
        .attr("y", function(d) { return -1 * valueToY(d); })
        .text(function(d) { return d; });

      focusedPosition.attr("visibility", "visible");
    }
  };
  chartBg.on("mousemove", popFocusedAxis);
  chartBg.on("mouseleave", function() {
    focusedPosition.attr("visibility", "hidden");
  });
}
