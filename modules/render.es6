// Dependencies
import * as d3 from "d3";
import { validate } from "jsonschema";

// Validation schemas
import LineSchema from "./schemas/line.schema.json";
import StackSchema from "./schemas/stack.schema.json";
import TimelineSchema from "./schemas/timeline.schema.json";
const WTF_SCHEMAS = {
  line: LineSchema,
  stack: StackSchema,
  timeline: TimelineSchema
};

// Renderer functions
import TheFuckCommon from "./renderer/Common.es6";
import TheFuckError from "./renderer/Error.es6";
import TheFuckLine from "./renderer/Line.es6";
import TheFuckStack from "./renderer/Stack.es6";
import TheFuckTimeline from "./renderer/Timeline.es6";
const WTF_RENDERERS = {
  error: TheFuckError,
  line: TheFuckLine,
  stack: TheFuckStack,
  timeline: TheFuckTimeline
};

// Inline style
import TheFuckStyles from "./styles.es6";

// Global parameters for all renderers.
const WTF_PARAMS = {
  margin: 20
};

// Scan hook points (CSS class render-the-fuck)
d3.selectAll(".render-the-fuck").each(function() {
  const svg = d3.select(this);
  const id  = svg.attr("id");
  let thefuck = window.RENDER_THE_FUCK[id];
  let hasError = false;

  const AVAILABLE_WTFS = ["line", "stack", "timeline"];
  if (AVAILABLE_WTFS.indexOf(thefuck.wtf) !== -1) {
    const vdErrors = validate(thefuck, WTF_SCHEMAS[thefuck.wtf]).errors;
    if (vdErrors.length > 0) {
      const vdMsg = vdErrors.map(function(err) {
        const n = err.property;
        return n.charAt(0).toUpperCase() + n.slice(1) + " " + err.message;
      });

      hasError = true;
      thefuck = {
        "wtf": "error",
        "settings": {
          "message": vdMsg
        }
      };
    }
  } else {
    hasError = true;
    if (thefuck.wtf !== "error") {
      thefuck = {
        "wtf": "error",
        "settings": {
          "message": "Unrecognize what the fuck."
        }
      };
    }
  }

  // Render the fuck.
  TheFuckCommon.call(svg, thefuck, WTF_PARAMS);
  WTF_RENDERERS[thefuck.wtf].call(svg, thefuck, WTF_PARAMS);

  // Render download link.
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

    // Create <a> element.
    d3.select("#" + ftid).append("a")
      .attr("href", link)
      .attr("download", id + ".svg")
      .text("Download");
  }
});
