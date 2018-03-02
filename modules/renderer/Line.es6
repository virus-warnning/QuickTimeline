// The fuck line
export default function(d3, thefuck, P) {
  const svg = this;
  svg.classed("rtf-line", true);

  // Draw legends.
  const legendCicleR = 7;
  const legendTextHeight = 12;
  const legendIcon = svg.append("g").classed("legendIcon", true);
  const legendText = svg.append("g").classed("legendText", true);
  const fnLegendY = function(d, i) { return i * 25; };
  legendIcon.selectAll("circle").data(thefuck.lines).enter().append("circle")
    .attr("cx", 0)
    .attr("cy", fnLegendY)
    .attr("r", legendCicleR);
  legendText.selectAll("text").data(thefuck.lines).enter().append("text")
    .attr("x", 0)
    .attr("y", fnLegendY)
    .text(function(d) { return d.name; });

  // Move legends to proper location.
  const legendTextWidth = P.fnMaxTextWidth(legendText);
  const textTx = svg.attr("width") - (P.margin + legendTextWidth);
  const textTy = P.margin + legendTextHeight;
  const iconTx = textTx - (legendCicleR + 5);
  const iconTy = P.margin + legendCicleR;
  legendIcon.attr("transform", P.fnTranslate(iconTx, iconTy));
  legendText.attr("transform", P.fnTranslate(textTx, textTy));

  // Draw chart area
  const chart = svg.append("g").classed("chart", true);
  const chartBg = chart.append("rect");

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

  // Draw y scale
  let origY = svg.attr("height") - (P.margin + P.titleHeight);
  if (thefuck.settings.subtitle) origY -= P.subtitleHeight;
  const chartHeight = origY - P.margin;
  const yRatio = chartHeight / (uBound - lBound);
  const valueToY = function(d) { return Math.floor((d - lBound) * yRatio); };
  const yScaleGroup = chart.append("g").classed("yscale", true);
  const scaleValues = [];
  for (let v=lBound; v<uBound; v+=scale*2) {
    scaleValues.push(v);
  }
  yScaleGroup.selectAll("line").data(scaleValues).enter().append("line")
    .attr("x1", 0)
    .attr("y1", valueToY)
    .attr("x2", 5)
    .attr("y2", valueToY);
  yScaleGroup.selectAll("text").data(scaleValues).enter().append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("transform", function(d) { return P.fnCartesianCoord(-5, valueToY(d) - 5); })
    .text(P.fnValue);
  const yScaleWidth = P.fnMaxTextWidth(yScaleGroup);

  // Move chart to proper location.
  const origX = P.margin + yScaleWidth + 5;
  chart.attr("transform", P.fnCartesianCoord(origX, origY));

  // TODO: Draw x scale
  const chartWidth = svg.attr("width") - P.margin * 2 - yScaleWidth - legendTextWidth - legendCicleR*2 - 5 - 5 - 10;
  const xRatio = chartWidth / (thefuck.labels.length - 1);
  const xScaleGroup = chart.append("g").classed("xscale", true);
  const indices = [
    1,
    Math.floor(thefuck.labels.length / 2),
    thefuck.labels.length - 1
  ];
  xScaleGroup.selectAll("line").data(indices).enter().append("line")
    .attr("x1", function(d) { return d * xRatio; })
    .attr("y1", 0)
    .attr("x2", function(d) { return d * xRatio; })
    .attr("y2", 5);

  // Resize background
  chartBg
    .attr("width", chartWidth)
    .attr("height", chartHeight);

  // Axises
  const axisPath = d3.path();
  axisPath.moveTo(0, chartHeight);
  axisPath.lineTo(0, 0);
  axisPath.lineTo(chartWidth, 0);
  chart.append("path").classed("axis", true)
    .attr("d", axisPath.toString());

  // Draw lines
  const pathFunction = d3.line()
    .x(function(d, i) { return Math.floor(i * xRatio); })
    .y(function(d) { return Math.floor((d - lBound) * yRatio); });
  const lineGroup = chart.append("g").classed("line", true);
  lineGroup.selectAll("path").data(thefuck.lines).enter()
    .append("path")
    .attr("d", function(d) { return pathFunction(d.data); });

  // Draw Focused Position
  let defaultFocusedPosition = thefuck.labels.length - 1;
  if (thefuck.settings.defaultIndex !== undefined) {
    defaultFocusedPosition = thefuck.settings.defaultIndex;
  }
  let currentFocusedPosition = defaultFocusedPosition;
  const focusedPosition = chart.append("g").classed("focusedPosition", true)
    .attr("visibility", "hidden");
  const focusedAxis = focusedPosition.append("line").classed("focusedAxis", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", chartHeight);
  const focusedLabel = focusedPosition.append("text").classed("focusedLabel", true)
    .attr("transform", "scale(1 -1)")
    .attr("x", 0)
    .attr("y", 0);
  const focusedPointGroup = focusedPosition.append("g").classed("focusedPoint", true);
  focusedPointGroup.selectAll("circle").data(thefuck.lines).enter()
    .append("circle")
    .attr("r", 4);
  const focusedValueBorderGroup = focusedPosition.append("g").classed("focusedValueBorder", true)
    .attr("transform", "translate(15 -12)");
  focusedValueBorderGroup.selectAll("rect").data(thefuck.lines).enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 8)
    .attr("ry", 8)
    .attr("width", 50)
    .attr("height", 25);
  const focusedValueGroup = focusedPosition.append("g").classed("focusedValue", true)
    .attr("transform", "translate(20 0) scale(1 -1)");
  focusedValueGroup.selectAll("text").data(thefuck.lines).enter()
    .append("text")
    .attr("x", 0)
    .attr("y", 0);
  const popFocusedAxis = function(index) {
    const focusedAxisX = Math.floor(index * xRatio);
    const valueToY = function(d) { return Math.floor((d - lBound) * yRatio); };
    const values = thefuck.lines.map((line) => {
      return line.data[index];
    });

    focusedAxis
      .attr("x1", focusedAxisX)
      .attr("x2", focusedAxisX);

    focusedLabel
      .attr("transform", P.fnCartesianCoord(focusedAxisX, chartHeight))
      .text(thefuck.labels[index]);

    focusedPointGroup.selectAll("circle").data(values)
      .attr("cx", focusedAxisX)
      .attr("cy", valueToY);

    focusedValueBorderGroup.selectAll("rect").data(values)
      .attr("x", focusedAxisX)
      .attr("y", valueToY);

    focusedValueGroup.selectAll("text").data(values)
      .attr("transform", function(d) {
        return P.fnTranslate(focusedAxisX, -1 * valueToY(d));
      })
      .text(function(d) { return d; });

    // Avoid overlap
    focusedPosition.attr("visibility", "visible");
  };
  if (defaultFocusedPosition >= 0) {
    popFocusedAxis(defaultFocusedPosition);
  }

  chartBg.on("mousemove", function() {
    const index = Math.round((event.offsetX - P.margin) / xRatio);
    if (index >= 0 && index < thefuck.labels.length) {
      currentFocusedPosition = index;
      popFocusedAxis(index);
    }
  });
  chartBg.on("mouseleave", function() {
    currentFocusedPosition = defaultFocusedPosition;
    setTimeout(function() {
      if (currentFocusedPosition === defaultFocusedPosition) {
        if (defaultFocusedPosition < 0) {
          focusedPosition.attr("visibility", "hidden");
        } else {
          popFocusedAxis(defaultFocusedPosition);
        }
      }
    }, 1000);
  });
}