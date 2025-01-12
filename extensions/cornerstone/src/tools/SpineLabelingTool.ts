
import { BaseTool } from '@cornerstonejs/tools';
import { annotation } from '@cornerstonejs/tools';
import { getEnabledElement } from '@cornerstonejs/core';
import * as cornerstone from '@cornerstonejs/core';

const SPINE_LABELS = [
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
  'L1', 'L2', 'L3', 'L4', 'L5',
  'S1', 'S2', 'S3', 'S4', 'S5'
];

export default class SpineLabelingTool extends BaseTool {
  static toolName = 'SpineLabeling';

  constructor(
    toolProps = {},
    defaultToolProps = {
      supportedInteractionTypes: ['Mouse', 'Touch'],
    }
  ) {
    super(toolProps, defaultToolProps);
  }

  preMouseDownCallback = (evt) => {
    const eventDetail = evt.detail;
    const { element, currentPoints } = eventDetail;
    const { canvasPoints } = currentPoints;

    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;

    const camera = viewport.getCamera();
    const { viewPlaneNormal, viewUp } = camera;

    const annotationUID = annotation.state.addAnnotation({
      metadata: {
        toolName: this.getToolName(),
        viewPlaneNormal: [...viewPlaneNormal],
        viewUp: [...viewUp],
        FrameOfReferenceUID: viewport.getFrameOfReferenceUID(),
        referencedImageId: viewport.getCurrentImageId(),
      },
      data: {
        handles: {
          points: [[canvasPoints[0], canvasPoints[1]]],
          activeHandleIndex: null,
          textBox: {
            hasMoved: false,
            worldPosition: [0, 0, 0],
            worldBoundingBox: {
              topLeft: [0, 0, 0],
              topRight: [0, 0, 0],
              bottomLeft: [0, 0, 0],
              bottomRight: [0, 0, 0],
            },
          },
        },
        label: '',
        cachedStats: {},
      },
    });

    const annotation = cornerstone.state.getAnnotation(annotationUID);
    
    // Add to cornerstone tools rendered objects
    annotation.annotationUID = annotationUID;
    cornerstone.state.setAnnotation(annotationUID, annotation);

    // Trigger render
    viewport.render();

    return annotationUID;
  };

  renderAnnotation = (annotation, element) => {
    if (!annotation?.data?.handles?.points?.length) {
      return;
    }

    const { points } = annotation.data.handles;
    const context = element.getContext('2d');
    
    // Draw point
    context.beginPath();
    context.arc(points[0][0], points[0][1], 3, 0, 2 * Math.PI);
    context.fill();
    
    // Draw label
    if (annotation.data.label) {
      context.font = '14px Arial';
      context.fillText(annotation.data.label, points[0][0] + 5, points[0][1]);
    }
  };
}
