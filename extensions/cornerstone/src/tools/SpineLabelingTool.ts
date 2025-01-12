import { BaseTool } from '@cornerstonejs/tools';
import { annotation, drawing } from '@cornerstonejs/tools';
import { getEnabledElement } from '@cornerstonejs/core';
import { servicesManager } from '@cornerstonejs/core';

const SPINE_LABELS = [
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7',
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
  'L1', 'L2', 'L3', 'L4', 'L5',
  'S1'
];

class SpineLabelingTool extends BaseTool {
  static toolName = 'SpineLabeling';
  currentLabelIndex = 0;

  constructor(props = {}) {
    super({
      name: 'SpineLabeling',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        shadow: true,
        ...props,
      },
    });
  }

  preMouseDownCallback = (evt) => {
    const { element, currentPoints } = evt.detail;
    const enabledElement = getEnabledElement(element);
    const { viewport } = enabledElement;
    const worldPos = currentPoints.world;
    const canvasPos = currentPoints.canvas;

    if (this.currentLabelIndex >= SPINE_LABELS.length) {
      this.currentLabelIndex = 0;
    }

    const label = SPINE_LABELS[this.currentLabelIndex];

    // Create annotation
    const annotation = {
      highlighted: true,
      invalidated: true,
      metadata: {
        toolName: this.name,
        viewportId: enabledElement.viewport.id,
        label,
      },
      data: {
        text: label,
        handles: {
          points: [[worldPos[0], worldPos[1], worldPos[2]]],
        },
      },
    };

    const eventDetail = {
      annotation: {
        annotationUID: annotation.uid,
        metadata: {
          toolName: this.getToolName(),
          FrameOfReferenceUID: annotation.metadata.FrameOfReferenceUID,
        },
        data: annotation.data
      }
    };

    const measurementService = servicesManager.services.measurementService;
    const sourceUID = measurementService.addMeasurement(this.getToolName(), eventDetail);

    // Update annotation with measurement UID
    annotation.uid = sourceUID;

    // Draw the label
    const context = element.getContext('2d');
    context.save();
    context.font = '16px Arial';
    context.fillStyle = 'yellow';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(label, canvasPos[0], canvasPos[1]);
    context.restore();

    this.currentLabelIndex++;
    return true;
  };
}

export default SpineLabelingTool;