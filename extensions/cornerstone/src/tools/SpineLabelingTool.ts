import { getEnabledElement, Types } from '@cornerstonejs/core';
import {
  BaseTool,
  PublicToolProps,
  ToolProps,
  EventTypes,
  SVGDrawingHelper,
} from '@cornerstonejs/tools';

class SpineLabelingTool extends BaseTool {
  static toolName = 'SpineLabeling';
  private annotations: any[] = [];
  private currentIndex = 0;
  private vertebraeSequence = [
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
    'L1', 'L2', 'L3', 'L4', 'L5'
  ];
  private isInitialized = false;
  private isDescending = false;
  private startingLabel = 'C1';

  constructor(
    toolProps: PublicToolProps = {},
    defaultToolProps: ToolProps = {
      supportedInteractionTypes: ['Mouse', 'Touch'],
    }
  ) {
    super(toolProps, defaultToolProps);
  }

  private async initialize(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const dialog = document.createElement('dialog');
      dialog.innerHTML = `
        <div style="
          padding: 20px;
          font-family: sans-serif;
          background: #151515;
          color: #ffffff;
          border-radius: 8px;
          min-width: 300px;
        ">
          <h3 style="
            margin: 0 0 15px 0;
            color: #0944b3;
            font-size: 18px;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
          ">Spine Labeling Configuration</h3>

          <div style="margin-bottom: 15px;">
            <label style="color: #91b9ff;">Starting vertebra:</label><br>
            <select id="vertebra" style="
              margin: 5px 0;
              padding: 8px;
              width: 100%;
              background: #2a2a2a;
              border: 1px solid #444;
              color: #ffffff;
              border-radius: 4px;
            ">
              ${this.vertebraeSequence.map(v => `<option value="${v}">${v}</option>`).join('')}
            </select>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="color: #91b9ff;">Labeling order:</label><br>
            <select id="order" style="
              margin: 5px 0;
              padding: 8px;
              width: 100%;
              background: #2a2a2a;
              border: 1px solid #444;
              color: #ffffff;
              border-radius: 4px;
            ">
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>

          <button style="
            padding: 10px 20px;
            cursor: pointer;
            background: #0944b3;
            color: white;
            border: none;
            border-radius: 4px;
            width: 100%;
            font-weight: 500;
            transition: background 0.2s;
          ">Start Labeling</button>
        </div>
      `;

      dialog.style.padding = '0';
      dialog.style.border = 'none';
      dialog.style.background = 'transparent';

      const button = dialog.querySelector('button');
      button.addEventListener('mouseover', () => {
        button.style.background = '#0b5ed7';
      });
      button.addEventListener('mouseout', () => {
        button.style.background = '#0944b3';
      });

      document.body.appendChild(dialog);
      dialog.showModal();

      const vertebraSelect = dialog.querySelector('#vertebra');
      const orderSelect = dialog.querySelector('#order');
      const button1 = dialog.querySelector('button');

      button1.addEventListener('click', () => {
        this.startingLabel = vertebraSelect.value;
        this.isDescending = orderSelect.value === 'Descending';
        this.currentIndex = this.vertebraeSequence.indexOf(this.startingLabel);

        if (this.isDescending) {
          this.vertebraeSequence.reverse();
          this.currentIndex = this.vertebraeSequence.indexOf(this.startingLabel);
        }

        this.isInitialized = true;
        dialog.close();
        dialog.remove();
        resolve();
      });
    });
  }

  private getCurrentLabel(): string {
    return this.vertebraeSequence[this.currentIndex] || 'Done';
  }

  private getViewportId(element: HTMLDivElement): string {
    const enabledElement = getEnabledElement(element);
    return enabledElement?.viewport?.id || '';
  }

  private getFrameOfReferenceUID(element: HTMLDivElement): string {
    const enabledElement = getEnabledElement(element);
    const frameOfReference = enabledElement?.viewport?.options?.background?.frameOfReferenceUID;
    return frameOfReference || '';
  }

  private addAnnotation(annotation: any): void {
    this.annotations.push(annotation);
    annotation.invalidated = true;
    if (this.currentIndex < this.vertebraeSequence.length - 1) {
      this.currentIndex++;
    }
  }

  private getAnnotations(): any[] {
    return this.annotations;
  }

  private worldToCanvas(enabledElement: Types.IEnabledElement, point: number[]): number[] {
    const { viewport } = enabledElement;
    return viewport.worldToCanvas(point);
  }

  preMouseDownCallback = async (evt: EventTypes.MouseDownActivateEventType): Promise<boolean> => {
    const eventData = evt.detail;
    const { element, currentPoints } = eventData;
    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;

    if (!this.isInitialized) {
      await this.initialize(element);
    }

    if (this.currentIndex >= this.vertebraeSequence.length) {
      console.log('All vertebrae labeled');
      return false;
    }

    const worldPos = currentPoints.world;
    const annotation = {
      highlighted: true,
      invalidated: true,
      metadata: {
        toolName: this.getToolName(),
        viewportId: this.getViewportId(element),
        FrameOfReferenceUID: this.getFrameOfReferenceUID(element),
        referencedImageId: viewport.getCurrentImageId(),
      },
      data: {
        label: this.getCurrentLabel(),
        handles: {
          points: [[worldPos[0], worldPos[1], worldPos[2]]],
        },
      },
    };

    this.addAnnotation(annotation);
    evt.preventDefault();
    evt.stopPropagation();

    if (enabledElement?.viewport) {
      enabledElement.viewport.render();
    }

    return true;
  };

  onImageRendered = (evt: any): void => {
    const eventData = evt.detail;
    const { element } = eventData;
    const enabledElement = getEnabledElement(element);
    if (!enabledElement) return;

    const { renderingEngine } = enabledElement;
    const viewport = renderingEngine.getViewport(element);

    this.renderAnnotation(enabledElement, viewport.getSvgLayer());
  };

  renderAnnotation = (
    enabledElement: Types.IEnabledElement,
    svgDrawingHelper: SVGDrawingHelper
  ): boolean => {
    const { viewport } = enabledElement;
    const currentImageId = viewport.getCurrentImageId();

    // Filter annotations for current image
    const annotations = this.getAnnotations().filter(
      annotation => annotation.metadata.referencedImageId === currentImageId
    );

    if (!annotations.length) return false;

    annotations.forEach(annotation => {
      const { data } = annotation;
      const { label, handles } = data;
      const point = handles.points[0];
      const canvasCoords = this.worldToCanvas(enabledElement, point);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', canvasCoords[0].toString());
      circle.setAttribute('cy', canvasCoords[1].toString());
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', 'yellow');
      circle.setAttribute('stroke', 'yellow');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (canvasCoords[0] + 5).toString());
      text.setAttribute('y', canvasCoords[1].toString());
      text.setAttribute('fill', 'yellow');
      text.textContent = label;

      svgDrawingHelper.appendNode(circle);
      svgDrawingHelper.appendNode(text);
      svgDrawingHelper.setNodeTouched(circle);
      svgDrawingHelper.setNodeTouched(text);
    });

    return true;
  };
}

export default SpineLabelingTool;
