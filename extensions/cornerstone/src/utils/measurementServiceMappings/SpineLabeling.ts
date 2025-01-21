
import { utilities } from '@cornerstonejs/tools';

const SpineLabeling = {
  toAnnotation: (measurement) => {
    const { points, label } = measurement;

    return {
      toolName: 'SpineLabeling',
      data: {
        handles: {
          points: [points],
          activeHandleIndex: null,
          textBox: {
            hasMoved: false,
          },
        },
        label,
        cachedStats: {},
      },
    };
  },
  toMeasurement: (annotation) => {
    const { data } = annotation;
    const { handles } = data;
    const { points } = handles;

    return {
      label: data.label || '',
      points: points[0],
      uid: annotation.annotationUID,
    };
  },
  matchingCriteria: {
    points: 1,
  },
};

export default SpineLabeling;
import { annotation } from '@cornerstonejs/tools';
import { getSOPInstanceAttributes } from './utils';
import { Types } from '@cornerstonejs/core';

const SUPPORTED_TOOLS = ['SpineLabeling'];

const SpineLabeling = {
  toAnnotation: measurement => {},

  toMeasurement: (
    csToolsEventDetail,
    displaySetService,
    CornerstoneViewportService,
    getValueTypeFromToolType,
    customizationService
  ) => {
    const { annotation, viewportId } = csToolsEventDetail;
    const { metadata, data, annotationUID } = annotation;

    if (!metadata || !data) {
      console.warn('Spine Labeling tool: Missing metadata or data');
      return null;
    }

    const { toolName, referencedImageId, FrameOfReferenceUID } = metadata;
    const validToolType = SUPPORTED_TOOLS.includes(toolName);

    if (!validToolType) {
      throw new Error('Tool not supported');
    }

    const { SOPInstanceUID, SeriesInstanceUID, StudyInstanceUID } = getSOPInstanceAttributes(
      referencedImageId,
      CornerstoneViewportService,
      viewportId
    );

    let displaySet;

    if (SOPInstanceUID) {
      displaySet = displaySetService.getDisplaySetForSOPInstanceUID(
        SOPInstanceUID,
        SeriesInstanceUID
      );
    } else {
      displaySet = displaySetService.getDisplaySetsForSeries(SeriesInstanceUID);
    }

    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      SeriesInstanceUID,
      StudyInstanceUID,
      toolName,
      metadata,
      data,
    };
  },
};

export default SpineLabeling;
