// TypeError: Cannot read property 'selection' of undefined.
// (d3 will become _d after babelified.)

const d3 = require("d3");

// Validation tool
import { validate } from "jsonschema";
import schema from "./schemas/timeline.schema.json";

// Renderer functions
import TheFuckTimeline from "./renderer/Timeline.es6";
import TheFuckStack from "./renderer/Stack.es6";
import TheFuckError from "./renderer/Error.es6";

d3.selection.prototype.theFuckTimeline = TheFuckTimeline;
d3.selection.prototype.theFuckStack = TheFuckStack;
d3.selection.prototype.theFuckError = TheFuckError;

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
    case "stack":
      // vdErrors = validate(thefuck, schema).errors;
      // if (vdErrors.length === 0) {
      d3.select(this).theFuckStack(thefuck);
      // }
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
      vdMsg.push(n.charAt(0).toUpperCase() + n.slice(1) + " " + err.message);
    }
    d3.select(this).theFuckError({
      "wtf": "error",
      "settings": {
        "message": vdMsg
      }
    });
  }
});
