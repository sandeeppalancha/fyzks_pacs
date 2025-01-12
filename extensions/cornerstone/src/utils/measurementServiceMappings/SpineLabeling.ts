
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
