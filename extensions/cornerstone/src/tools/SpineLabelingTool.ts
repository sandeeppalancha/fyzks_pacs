import { Types } from '@cornerstonejs/core';
import {
  BaseTool,
  PublicToolProps,
  ToolProps,
  EventTypes,
} from '@cornerstonejs/tools';

class SpineLabelingTool extends BaseTool {
  static toolName = 'SpineLabeling';

  constructor(
    toolProps: PublicToolProps = {},
    defaultToolProps: ToolProps = {
      supportedInteractionTypes: ['Mouse', 'Touch'],
    }
  ) {
    super(toolProps, defaultToolProps);
  }

  preMouseDownCallback = (
    evt: EventTypes.MouseDownActivateEventType
  ): boolean => {
    const eventData = evt.detail;
    const { element, currentPoints } = eventData;
    const worldPos = currentPoints.world;

    const annotation = {
      highlighted: true,
      invalidated: true,
      metadata: {
        toolName: this.getToolName(),
        viewportId: this.getViewportId(element),
        FrameOfReferenceUID: this.getFrameOfReferenceUID(element),
      },
      data: {
        label: 'C1', // Default label - can be changed through UI
        handles: {
          points: [[worldPos[0], worldPos[1], worldPos[2]]],
        },
      },
    };

    this.addAnnotation(annotation);
    return true;
  };

  renderAnnotation = (
    enabledElement: Types.IEnabledElement,
    svgDrawingHelper: any
  ): boolean => {
    const annotations = this.getAnnotations();

    annotations.forEach(annotation => {
      const { data } = annotation;
      const { label, handles } = data;
      const point = handles.points[0];

      const canvasCoords = this.worldToCanvas(enabledElement, point);

      const circle = svgDrawingHelper.createCircle({
        cx: canvasCoords[0],
        cy: canvasCoords[1],
        r: 3,
        stroke: 'yellow',
        fill: 'yellow',
      });

      const text = svgDrawingHelper.createText({
        x: canvasCoords[0] + 5,
        y: canvasCoords[1],
        text: label,
        stroke: 'yellow',
      });

      svgDrawingHelper.appendChild(circle);
      svgDrawingHelper.appendChild(text);
    });

    return true;
  };
}

export default SpineLabelingTool;