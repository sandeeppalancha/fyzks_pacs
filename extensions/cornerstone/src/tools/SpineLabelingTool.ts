
import { Types } from '@cornerstonejs/core';
import { BaseTool } from '@cornerstonejs/tools';
import { getSOPInstanceAttributes } from '../utils/measurementServiceMappings/utils';

const { drawHandles, drawLine } = BaseTool.drawingSvg;

class SpineLabelingTool extends BaseTool {
  static toolName = 'SpineLabeling';

  constructor(
    configuration = {
      configuration: {
        shadow: true,
        preventHandleOutsideImage: true,
      },
    }
  ) {
    super(configuration);

    this.configuration.getTextCallback = configuration.getTextCallback || ((annotation) => {
      return `Spine Label: ${annotation.data.text || ''}`;
    });
  }

  addNewAnnotation(evt) {
    const eventData = evt.detail;
    const { element, currentPoints } = eventData;

    const worldPos = currentPoints.world;

    const annotation = {
      highlighted: true,
      invalidated: true,
      metadata: {
        toolName: this.getToolName(),
        viewPlaneNormal: [...eventData.camera.viewPlaneNormal],
        viewUp: [...eventData.camera.viewUp],
        FrameOfReferenceUID: eventData.renderingEngine.getRenderingEngine(
          eventData.viewportId
        ).frameOfReferenceUID,
        referencedImageId: eventData.image.imageId,
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
    const { element, viewport } = evt.detail;
    const { annotation } = evt.detail;
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
