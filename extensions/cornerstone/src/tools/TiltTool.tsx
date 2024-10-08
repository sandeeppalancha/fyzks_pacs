// const BaseTool = cornerstoneTools.import('base/BaseTool');

import { BaseTool } from "@cornerstonejs/tools";
import { getEnabledElement } from '@cornerstonejs/core';
import type { Types } from '@cornerstonejs/core';

import { EventTypes } from '@cornerstonejs/core/src/types';
import { debounce } from "lodash";

class CustomDragTool extends BaseTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'CustomDragTool',
      strategies: {},
      configuration: {},
    };

    super(props, defaultProps);
  }

  touchDragCallback(evt) {
    this.mouseDragCallback(evt);
  }

  mouseDragCallback(evt) {
    // Custom logic for dragging
    const eventData = evt.detail;
    // console.log('Mouse Drag Detected', eventData);
    this.debouncedDrag(evt);

    // viewport.setCamera({ viewPlaneNormal, viewUp });
    // Add your custom behavior here, such as tilting or panning

  }

  debouncedDrag = debounce((evt) => {
    this._dragCallback(evt);
  }, 50);

  _dragCallback(evt: EventTypes.InteractionEventType) {
    const { element, deltaPoints } = evt.detail;
    const enabledElement = getEnabledElement(element);

    const currentCamera = enabledElement.viewport.getCamera();
    const tiltSensitivity = 0.5;

    const deltaX = deltaPoints.page[0];
    const deltaY = deltaPoints.page[1];

    // Calculate the tilt angles from mouse movement
    const angleX = deltaX * tiltSensitivity;  // Horizontal movement (Y-axis tilt)
    const angleY = deltaY * tiltSensitivity;  // Vertical movement (X-axis tilt)

    // Get the current camera properties
    const { position, focalPoint, viewUp } = currentCamera;

    // Calculate the current viewPlaneNormal (direction camera is looking)
    const viewPlaneNormal = [
      focalPoint[0] - position[0],
      focalPoint[1] - position[1],
      focalPoint[2] - position[2],
    ];

    // const viewPlaneNormal = [1, 0, 0];

    // Normalize the viewPlaneNormal vector
    const magnitude = Math.sqrt(
      viewPlaneNormal[0] ** 2 + viewPlaneNormal[1] ** 2 + viewPlaneNormal[2] ** 2
    );
    const normalizedViewPlaneNormal = [
      viewPlaneNormal[0] / magnitude,
      viewPlaneNormal[1] / magnitude,
      viewPlaneNormal[2] / magnitude,
    ];

    // Apply horizontal tilt around Y-axis (left/right tilt)
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const newViewPlaneNormalX = [
      normalizedViewPlaneNormal[0] * cosX - normalizedViewPlaneNormal[2] * sinX,
      normalizedViewPlaneNormal[1],
      normalizedViewPlaneNormal[0] * sinX + normalizedViewPlaneNormal[2] * cosX,
    ];

    // Apply vertical tilt around X-axis (up/down tilt)
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const newViewPlaneNormalY = [
      newViewPlaneNormalX[0],
      newViewPlaneNormalX[1] * cosY - newViewPlaneNormalX[2] * sinY,
      newViewPlaneNormalX[1] * sinY + newViewPlaneNormalX[2] * cosY,
    ];

    // Calculate the new camera position after the tilt
    const newPosition = [
      focalPoint[0] - newViewPlaneNormalY[0] * magnitude,
      focalPoint[1] - newViewPlaneNormalY[1] * magnitude,
      focalPoint[2] - newViewPlaneNormalY[2] * magnitude,
    ];

    // Set the new camera position and view
    enabledElement.viewport.setCamera({
      position: newPosition,
      focalPoint,
      viewUp, //: [0, 0, 1],  // Optionally adjust the viewUp vector if required for orientation
      // parallelProjection: true, // Use parallel projection for medical imaging
    });
    enabledElement.viewport.render();


    // const viewPlaneNormal = [0, 0, 0.5]; // viewPlaneNormal[0] = 0;
    // const viewUp = [0, -1, -0]; // view
    // enabledElement.viewport.setCamera({ viewPlaneNormal, viewUp });
    // enabledElement.viewport.render();
  }
}

CustomDragTool.toolName = 'CustomDragTool'
// CustomDragTool.toolName = 'Tilt'
export default CustomDragTool;

// // Register the tool
// cornerstoneTools.addTool(CustomDragTool);

// // Set it as the active tool
// cornerstoneTools.setToolActive('CustomDragTool', { mouseButtonMask: 1 });
