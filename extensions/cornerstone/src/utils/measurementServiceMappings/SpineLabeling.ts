
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
