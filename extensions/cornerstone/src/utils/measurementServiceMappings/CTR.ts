// utils/measurementServiceMappings/CTR.js
import SUPPORTED_TOOLS from './constants/supportedTools';
import getSOPInstanceAttributes from './utils/getSOPInstanceAttributes';
import { utils } from '@ohif/core';

const CTR = {
  toAnnotation: measurement => {
    const { points, ratio } = measurement;
    return {
      data: {
        handles: {
          points,
          activeHandleIndex: null,
          textBox: {
            hasMoved: false,
          },
        },
        cachedStats: {
          ratio: ratio || 0,
        },
      },
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
      console.warn('CTR tool: Missing metadata or data');
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

    const displaySet = SOPInstanceUID
      ? displaySetService.getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID)
      : displaySetService.getDisplaySetsForSeries(SeriesInstanceUID)[0];

    const { points } = data.handles;
    const ratio = data.cachedStats?.ratio || 0;

    const mappedAnnotations = getMappedAnnotations(annotation, displaySetService);
    const displayText = getDisplayText(mappedAnnotations, displaySet, customizationService);
    const getReport = () => _getReport(ratio, points, FrameOfReferenceUID);

    return {
      uid: annotationUID,
      SOPInstanceUID,
      FrameOfReferenceUID,
      points,
      metadata,
      referenceSeriesUID: SeriesInstanceUID,
      referenceStudyUID: StudyInstanceUID,
      frameNumber: mappedAnnotations?.[0]?.frameNumber || 1,
      toolName: metadata.toolName,
      displaySetInstanceUID: displaySet.displaySetInstanceUID,
      label: data.label,
      displayText: displayText,
      data: data.cachedStats,
      type: getValueTypeFromToolType(toolName),
      getReport,
    };
  },

  matchingCriteria: [
    {
      valueType: 'POINT',
      points: 4,
    },
  ],
};

function getMappedAnnotations(annotation, DisplaySetService) {
  const { metadata, data } = annotation;
  const { cachedStats } = data;
  const { referencedImageId } = metadata;

  if (!referencedImageId) {
    return [];
  }

  const { SOPInstanceUID, SeriesInstanceUID, frameNumber } = getSOPInstanceAttributes(referencedImageId);

  const displaySet = DisplaySetService.getDisplaySetForSOPInstanceUID(
    SOPInstanceUID,
    SeriesInstanceUID,
    frameNumber
  );

  const { SeriesNumber } = displaySet;
  const ratio = cachedStats?.ratio || 0;

  return [{
    SeriesInstanceUID,
    SOPInstanceUID,
    SeriesNumber,
    frameNumber,
    ratio,
  }];
}

function getDisplayText(mappedAnnotations, displaySet) {
  if (!mappedAnnotations || !mappedAnnotations.length) {
    return '';
  }

  const { ratio, SeriesNumber, SOPInstanceUID, frameNumber } = mappedAnnotations[0];
  const instance = displaySet.images.find(image => image.SOPInstanceUID === SOPInstanceUID);
  const InstanceNumber = instance?.InstanceNumber;

  const instanceText = InstanceNumber ? ` I: ${InstanceNumber}` : '';
  const frameText = displaySet.isMultiFrame ? ` F: ${frameNumber}` : '';
  const roundedRatio = utils.roundNumber(ratio, 2);

  return [`CTR: ${roundedRatio} (S: ${SeriesNumber}${instanceText}${frameText})`];
}

function _getReport(ratio, points, FrameOfReferenceUID) {
  const columns = ['AnnotationType', 'CTR', 'FrameOfReferenceUID', 'points'];
  const values = [
    'Cornerstone:CTR',
    ratio,
    FrameOfReferenceUID,
    points.map(p => p.join(' ')).join(';'),
  ];

  return { columns, values };
}

export default CTR;
