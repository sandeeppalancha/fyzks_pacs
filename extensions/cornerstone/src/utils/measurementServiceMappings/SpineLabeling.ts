
import { getSOPInstanceAttributes } from './utils/getSOPInstanceAttributes';

const SpineLabeling = {
  toAnnotation: measurement => {
    const { label, coordinates, uid } = measurement;
    return {
      data: {
        label,
        handles: {
          points: [coordinates],
        },
      },
      annotationUID: uid,
    };
  },

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
    const { SOPInstanceUID, SeriesInstanceUID, StudyInstanceUID } =
      getSOPInstanceAttributes(
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
      toolName: annotation.metadata.toolName,
      label: data.label,
      coordinates: data.handles.points[0],
    };
  },
};

export default SpineLabeling;
import SUPPORTED_TOOLS from './constants/supportedTools';
import { getDisplayUnit } from './utils';
import getSOPInstanceAttributes from './utils/getSOPInstanceAttributes';
import { utils } from '@ohif/core';

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

    const { points, textBox } = data.handles;

    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      textBox,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      frameNumber: 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
    };
  },
};

export default SpineLabeling;
