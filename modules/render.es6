// TypeError: Cannot read property 'selection' of undefined.
// (d3 will become _d after babelified.)
// import d3 from "d3";
const d3 = require("d3");

// Validation tool
import { validate } from "jsonschema";
import StackSchema from "./schemas/stack.schema.json";
import TimelineSchema from "./schemas/timeline.schema.json";
const WtfSchema = {
  stack: StackSchema,
  timeline: TimelineSchema
};

// Renderer functions
import TheFuckTimeline from "./renderer/Timeline.es6";
import TheFuckStack from "./renderer/Stack.es6";
import TheFuckError from "./renderer/Error.es6";
d3.selection.prototype.theFuckTimeline = TheFuckTimeline;
d3.selection.prototype.theFuckStack = TheFuckStack;
d3.selection.prototype.theFuckError = TheFuckError;

// Inline style
import TheFuckStyles from "./styles.es6";

// Scan hook points (CSS class render-the-fuck)
d3.selectAll(".render-the-fuck").each(function() {
  const svg = d3.select(this);
  const id  = svg.attr("id");
  const thefuck = window.RENDER_THE_FUCK[id];

  // Common settings
  svg.attr("style", "border: 1px solid #ddd; border-radius: 8px;");

  // To save validation errors.
  let vdErrors = [];
  let hasError = false;

  // Bind and Render
  switch (thefuck.wtf) {
    case "timeline":
      vdErrors = validate(thefuck, WtfSchema[thefuck.wtf]).errors;
      if (vdErrors.length === 0) {
        svg.theFuckTimeline(thefuck);
      }
      break;
    case "stack":
      vdErrors = validate(thefuck, WtfSchema[thefuck.wtf]).errors;
      if (vdErrors.length === 0) {
        svg.theFuckStack(thefuck);
      }
      break;
    // An error occured at back-end.
    case "error":
      hasError = true;
      svg.theFuckError(thefuck);
      break;
    // Unrecognize what the fuck.
    default:
      hasError = true;
      svg.theFuckError({
        "wtf": "error",
        "settings": {
          "message": "Unrecognize what the fuck."
        }
      });
  }

  if (vdErrors.length > 0) {
    // Display validation errors.
    const vdMsg = [];
    for (const err of vdErrors) {
      const n = err.property;
      vdMsg.push(n.charAt(0).toUpperCase() + n.slice(1) + " " + err.message);
    }
    svg.theFuckError({
      "wtf": "error",
      "settings": {
        "message": vdMsg
      }
    });
    hasError = true;
  }

  if (!hasError) {
    // Create BLOB
    const ftid  = id + "-footer";
    const style = TheFuckStyles["common"] + TheFuckStyles[thefuck.wtf];
    const body  = svg.html();
    const w     = svg.attr("width");
    const h     = svg.attr("height");
    const blob  = new Blob(
      [
        "<?xml version=\"1.0\"?>",
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{W}\" height=\"{H}\">"
          .replace("{W}", w)
          .replace("{H}", h),
        body.replace("<defs></defs>", "<defs><style type=\"text/css\">" + style + "</style></defs>"),
        "</svg>"
      ],
      {"type": "image/xml+svg"}
    );
    const link = window.URL.createObjectURL(blob);

    // Create download link.
    d3.select("#" + ftid).append("a")
      .attr("href", link)
      .attr("download", id + ".svg")
      .text("Download");
  }
});
