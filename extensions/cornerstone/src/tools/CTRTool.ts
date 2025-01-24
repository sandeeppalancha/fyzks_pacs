import { BaseTool } from '@cornerstonejs/tools';
import { getEnabledElement } from '@cornerstonejs/core';
import { addAnnotation, getAnnotations } from '@cornerstonejs/tools/dist/esm/stateManagement/annotation/annotationState';
import {
  drawHandles as drawHandlesSvg,
  drawLinkedTextBox as drawLinkedTextBoxSvg,
  drawLine as drawLineSvg
} from '@cornerstonejs/tools/dist/esm/drawingSvg';
import { vec3 } from 'gl-matrix';
import { AnnotationTool } from '@cornerstonejs/tools/dist/esm/tools/base';

class CTRTool extends BaseTool {
  static toolName = 'CTR';
  private editData = null;
  private isDrawing = false;

  constructor(
    toolProps = {},
    defaultToolProps = {
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        shadow: true,
        preventHandleOutsideImage: false,
      },
    }
  ) {
    super(toolProps, defaultToolProps);
  }

  preMouseDownCallback = (evt) => {
    const { currentPoints, element } = evt.detail;
    const worldPos = currentPoints.world;
    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;

    // Get existing annotation or create new one
    const annotations = getAnnotations(this.getToolName(), element);
    let annotation = annotations?.[0];

    if (!annotation) {
      annotation = {
        highlighted: true,
        invalidated: true,
        metadata: {
          toolName: this.getToolName(),
          viewPlaneNormal: viewport.getCamera().viewPlaneNormal,
          viewUp: viewport.getCamera().viewUp,
          FrameOfReferenceUID: viewport.getFrameOfReferenceUID(),
          referencedImageId: this.getReferencedImageId(viewport, worldPos),
        },
        data: {
          handles: {
            points: [worldPos],
            activeHandleIndex: null,
            textBox: {
              hasMoved: false,
              worldPosition: [0, 0, 0],
            },
          },
          cachedStats: {
            ratio: null,
          },
        },
      };
      addAnnotation(annotation, element);
    } else {
      // Append point to existing annotation
      annotation.data.handles.points.push(worldPos);
      if (annotation.data.handles.points.length === 4) {
        this._calculateCachedStats(annotation);
      }
    }

    evt.preventDefault();
    evt.stopPropagation();
    viewport.render();

    return true;
  };

  _calculateCachedStats = (annotation) => {
    const { data } = annotation;
    const { points } = data.handles;

    if (points.length !== 4) return;

    const [point1, point2, point3, point4] = points;

    const thoracicWidth = vec3.distance(point1, point2);
    const cardiacWidth = vec3.distance(point3, point4);
    const ratio = cardiacWidth / thoracicWidth;

    data.cachedStats = { ratio };
    annotation.invalidated = false;
  }

  getReferencedImageId(viewport, worldPos, viewPlaneNormal, viewUp) {
    const targetId = this.getTargetId(viewport);
    const imageIds = viewport.getImageIds();

    // Return first imageId as default
    return imageIds?.[0] || '';
  }

  renderAnnotation = (enabledElement, svgDrawingHelper) => {
    const { viewport } = enabledElement;
    const { element } = viewport;

    // Get current image ID
    const currentImageId = viewport.getCurrentImageId();

    // Filter annotations for current image
    const annotations = getAnnotations(this.getToolName(), element)
      .filter(annotation => annotation.metadata.referencedImageId === currentImageId);

    // Rest of your render code remains the same...
    if (!annotations?.length) return;

    annotations.forEach(annotation => {
      const { data } = annotation;
      const { handles: { points } } = data;

      if (!points || points.length === 0) return;

      const canvasPoints = points.map(point => viewport.worldToCanvas(point));

      if (canvasPoints.length >= 2) {
        drawLineSvg(
          svgDrawingHelper,
          annotation.annotationUID,
          'THORACIC_LINE',
          canvasPoints[0],
          canvasPoints[1],
          { color: '#FFFF00' }
        );
      }

      if (canvasPoints.length >= 4) {
        drawLineSvg(
          svgDrawingHelper,
          annotation.annotationUID,
          'CARDIAC_LINE',
          canvasPoints[2],
          canvasPoints[3],
          { color: '#FFFF00' }
        );

        const midpoint = [
          (canvasPoints[2][0] + canvasPoints[3][0]) / 2,
          (canvasPoints[2][1] + canvasPoints[3][1]) / 2
        ];

        if (data.cachedStats?.ratio) {
          drawLinkedTextBoxSvg(
            svgDrawingHelper,
            annotation.annotationUID,
            'CTR_TEXT',
            [`CTR: ${data.cachedStats.ratio.toFixed(2)}`],
            midpoint,
            canvasPoints,
            { hasMoved: false },
            { color: '#FFFF00' }
          );
        }
      }

      drawHandlesSvg(
        svgDrawingHelper,
        annotation.annotationUID,
        'CTR_HANDLES',
        canvasPoints,
        { color: '#FFFF00' }
      );
    });

    return true;
  };
}

export default CTRTool;
