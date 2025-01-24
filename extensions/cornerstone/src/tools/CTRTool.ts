
import { BaseTool } from '@cornerstonejs/tools';
import { getEnabledElement } from '@cornerstonejs/core';
import type { Types } from '@cornerstonejs/core';

class CTRTool extends BaseTool {
  static toolName = 'CTRTool';
  _bounds: any;
  currentPoints: any[] = [];
  isCompleted: boolean = false;

  constructor(
    toolProps = {},
    defaultToolProps = {
      supportedInteractionTypes: ['Mouse', 'Touch'],
    }
  ) {
    super(toolProps, defaultToolProps);
  }

  preMouseDownCallback = (evt: Types.InteractionEventType): boolean => {
    const { currentPoints, element } = evt.detail;
    const worldPos = currentPoints.world;
    
    if (this.isCompleted) {
      this.currentPoints = [];
      this.isCompleted = false;
    }

    this.currentPoints.push(worldPos);

    if (this.currentPoints.length === 4) {
      // Calculate CTR
      const thoracicWidth = this.calculateDistance(
        this.currentPoints[0],
        this.currentPoints[1]
      );
      const cardiacWidth = this.calculateDistance(
        this.currentPoints[2],
        this.currentPoints[3]
      );
      const ratio = cardiacWidth / thoracicWidth;

      const annotation = {
        metadata: {
          toolName: this.getToolName(),
          FrameOfReferenceUID: element.dataset.frameOfReferenceUID,
        },
        data: {
          handles: {
            points: this.currentPoints,
          },
          thoracicWidth,
          cardiacWidth,
          ratio,
          label: `CTR: ${(ratio * 100).toFixed(2)}%`,
        },
      };

      this.addAnnotation(annotation);
      this.isCompleted = true;
    }

    return true;
  };

  calculateDistance(point1: any, point2: any): number {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  renderAnnotation = (evt: any) => {
    const { element, annotation } = evt.detail;
    const { renderingEngine, viewport } = getEnabledElement(element);
    const context = element.querySelector('canvas').getContext('2d');

    const points = annotation.data.handles.points;
    const canvasPoints = points.map(point => viewport.worldToCanvas(point));

    // Draw thoracic line
    context.beginPath();
    context.moveTo(canvasPoints[0][0], canvasPoints[0][1]);
    context.lineTo(canvasPoints[1][0], canvasPoints[1][1]);
    context.strokeStyle = 'blue';
    context.stroke();

    // Draw cardiac line
    context.beginPath();
    context.moveTo(canvasPoints[2][0], canvasPoints[2][1]);
    context.lineTo(canvasPoints[3][0], canvasPoints[3][1]);
    context.strokeStyle = 'red';
    context.stroke();

    // Draw label
    context.font = '14px Arial';
    context.fillStyle = 'white';
    context.fillText(annotation.data.label, canvasPoints[0][0], canvasPoints[0][1] - 10);
  };
}

export default CTRTool;
