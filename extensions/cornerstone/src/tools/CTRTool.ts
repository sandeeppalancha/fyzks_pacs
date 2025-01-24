import { BaseTool } from '@cornerstonejs/tools';
import { getEnabledElement, Types } from '@cornerstonejs/core';

class CTRTool extends BaseTool {
  static toolName = 'CTR';
  private leftPoints: number[][] = [];
  private rightPoints: number[][] = [];
  private cardiacPoints: number[][] = [];
  private clickCount = 0;
  private maxClicks = 4;

  constructor(
    toolProps = {},
    defaultToolProps = {
      supportedInteractionTypes: ['Mouse', 'Touch'],
    }
  ) {
    super(toolProps, defaultToolProps);
  }

  private resetPoints(): void {
    this.leftPoints = [];
    this.rightPoints = [];
    this.cardiacPoints = [];
    this.clickCount = 0;
  }

  private calculateRatio(): number {
    if (this.cardiacPoints.length !== 2 || this.leftPoints.length !== 1 || this.rightPoints.length !== 1) {
      return 0;
    }

    const cardiacWidth = Math.sqrt(
      Math.pow(this.cardiacPoints[1][0] - this.cardiacPoints[0][0], 2) +
      Math.pow(this.cardiacPoints[1][1] - this.cardiacPoints[0][1], 2)
    );

    const thoracicWidth = Math.sqrt(
      Math.pow(this.rightPoints[0][0] - this.leftPoints[0][0], 2) +
      Math.pow(this.rightPoints[0][1] - this.leftPoints[0][1], 2)
    );

    return cardiacWidth / thoracicWidth;
  }

  preMouseDownCallback = (evt: Types.MouseDownActivateEventType): boolean => {
    const { element, currentPoints } = evt.detail;
    const worldPos = currentPoints.world;

    if (this.clickCount >= this.maxClicks) {
      this.resetPoints();
    }

    switch (this.clickCount) {
      case 0:
        this.leftPoints.push([worldPos[0], worldPos[1], worldPos[2]]);
        break;
      case 1:
        this.rightPoints.push([worldPos[0], worldPos[1], worldPos[2]]);
        break;
      case 2:
      case 3:
        this.cardiacPoints.push([worldPos[0], worldPos[1], worldPos[2]]);
        break;
    }

    this.clickCount++;

    if (this.clickCount === this.maxClicks) {
      const ratio = this.calculateRatio();
      console.log('CTR:', ratio.toFixed(2));
    }

    const enabledElement = getEnabledElement(element);
    if (enabledElement?.viewport) {
      enabledElement.viewport.render();
    }

    evt.preventDefault();
    evt.stopPropagation();
    return true;
  };

  renderAnnotation = (
    enabledElement: Types.IEnabledElement,
    svgDrawingHelper: any
  ): void => {
    const { viewport } = enabledElement;

    // Draw thoracic width line
    if (this.leftPoints.length > 0 && this.rightPoints.length > 0) {
      const leftCanvas = viewport.worldToCanvas(this.leftPoints[0]);
      const rightCanvas = viewport.worldToCanvas(this.rightPoints[0]);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', leftCanvas[0].toString());
      line.setAttribute('y1', leftCanvas[1].toString());
      line.setAttribute('x2', rightCanvas[0].toString());
      line.setAttribute('y2', rightCanvas[1].toString());
      line.setAttribute('stroke', '#FFD700');
      line.setAttribute('stroke-width', '1.25');
      svgDrawingHelper.appendNode(line);
    }

    // Draw cardiac width line
    if (this.cardiacPoints.length === 2) {
      const start = viewport.worldToCanvas(this.cardiacPoints[0]);
      const end = viewport.worldToCanvas(this.cardiacPoints[1]);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', start[0].toString());
      line.setAttribute('y1', start[1].toString());
      line.setAttribute('x2', end[0].toString());
      line.setAttribute('y2', end[1].toString());
      line.setAttribute('stroke', '#348CFD');
      line.setAttribute('stroke-width', '1.25');
      svgDrawingHelper.appendNode(line);

      // Display ratio if all points are set
      if (this.clickCount === this.maxClicks) {
        const ratio = this.calculateRatio();
        const textX = (start[0] + end[0]) / 2;
        const textY = (start[1] + end[1]) / 2 - 10;

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', textX.toString());
        text.setAttribute('y', textY.toString());
        text.setAttribute('fill', '#FFD700');
        text.setAttribute('font-size', '14px');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = `CTR: ${ratio.toFixed(2)}`;
        svgDrawingHelper.appendNode(text);
      }
    }

    // Draw points
    const allPoints = [...this.leftPoints, ...this.rightPoints, ...this.cardiacPoints];
    allPoints.forEach(point => {
      const canvasPoint = viewport.worldToCanvas(point);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', canvasPoint[0].toString());
      circle.setAttribute('cy', canvasPoint[1].toString());
      circle.setAttribute('r', '2');
      circle.setAttribute('fill', '#FFD700');
      svgDrawingHelper.appendNode(circle);
    });
  };
}

export default CTRTool;
