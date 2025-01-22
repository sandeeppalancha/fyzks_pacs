import { Types } from '@cornerstonejs/core';
import { BaseTool, drawing } from '@cornerstonejs/tools';
import { getSOPInstanceAttributes } from '../utils/measurementServiceMappings/utils';

const { drawHandles, drawLine } = drawing;

class SpineLabelingTool extends BaseTool {
  static toolName = 'SpineLabeling';

  constructor(
    configuration = {
      configuration: {
        shadow: true,
        preventHandleOutsideImage: true,
        getToolState: (tool, viewport) => {
          return tool.annotations || [];
        },
      },
    }
  ) {
    super(configuration);

    this.annotations = [];
    this.configuration.getTextCallback = configuration.getTextCallback || ((annotation) => {
      return `Spine Label: ${annotation.data.text || ''}`;
    });
  }

  addNewAnnotation(evt) {
    const eventData = evt.detail;
    const { element, currentPoints, viewport } = eventData;

    if (!viewport || !currentPoints?.world) {
      return null;
    }

    const worldPos = currentPoints.world;
    const camera = viewport.getCamera();

    const annotation = {
      highlighted: true,
      invalidated: true,
      metadata: {
        toolName: this.getToolName(),
        viewPlaneNormal: Array.from(camera.viewPlaneNormal),
        viewUp: Array.from(camera.viewUp),
        FrameOfReferenceUID: viewport.frameOfReference,
        referencedImageId: viewport.getCurrentImageId(),
      },
      data: {
        handles: {
          points: [[...worldPos], [...worldPos]],
          activeHandleIndex: null,
          textBox: {
            hasMoved: false,
            worldPosition: [...worldPos],
            worldBoundingBox: {
              topLeft: [...worldPos],
              topRight: [...worldPos],
              bottomLeft: [...worldPos],
              bottomRight: [...worldPos],
            },
          },
        },
        text: '',
        cachedStats: {},
      },
    };

    return annotation;
  }

  renderAnnotation(evt) {
    if (!evt) {
      console.warn('No event data found');
      return;
    }

    const { viewport, viewportId, renderingEngine } = evt;
    if (!viewport || !viewportId || !renderingEngine) {
      console.warn('Missing required viewport properties');
      return;
    }

    // Get the annotation from the tool state
    const annotations = this.configuration.getToolState?.(this, viewport);
    const annotation = annotations?.[0];
    
    if (!annotation) {
      console.warn('No annotation data found');
      return;
    }

    // Get the element from the viewport
    const element = viewport.element;

    // Check required properties from evt.detail
    if (!element || !viewport) {
      console.warn('Missing required properties: element or viewport');
      return;
    }

    if (!annotation?.data?.handles?.points || !Array.isArray(annotation.data.handles.points)) {
      console.warn('Invalid annotation points data structure');
      return;
    }

    // Validate viewport has required methods
    if (typeof viewport.worldToCanvas !== 'function') {
      console.warn('Viewport missing worldToCanvas method');
      return;
    }

    const { data } = annotation;
    const { handles } = data;

    const canvasCoordinates = [];
    const points = handles.points;

    for (let i = 0; i < points.length; i++) {
      const worldPos = points[i];
      const canvasPos = viewport.worldToCanvas(worldPos);
      canvasCoordinates.push(canvasPos);
    }

    // Draw line and handles
    const color = this.getStyle('color', annotation);
    const lineWidth = this.getStyle('lineWidth', annotation);

    const options = {
      color,
      lineWidth,
    };

    drawLine(element, canvasCoordinates[0], canvasCoordinates[1], options);
    drawHandles(element, evt.detail, handles, { color });

    // Draw text
    if (data.text && data.text !== '') {
      const textWorldPosition = handles.textBox.worldPosition;
      const textCanvasPosition = viewport.worldToCanvas(textWorldPosition);

      const textOptions = {
        color: color,
        fontSize: this.getStyle('textBoxFontSize', annotation),
        background: this.getStyle('textBoxBackground', annotation),
        padding: 5,
      };

      annotation.annotationCanvasCoordinates = textCanvasPosition;
      annotation.options = textOptions;

      this.drawLabel(element, annotation);
    }
  }
}

export default SpineLabelingTool;