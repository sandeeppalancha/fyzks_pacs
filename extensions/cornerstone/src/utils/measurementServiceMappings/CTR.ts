
import { annotation } from '@cornerstonejs/tools';
import { utils } from '@ohif/core';

const CTR = {
  toAnnotation: (measurement) => {
    const { CTRtool } = annotation.INTERNAL;
    return CTRtool.toAnnotation(measurement);
  },
  toMeasurement: (annotation) => {
    const { CTRtool } = annotation.INTERNAL;
    return CTRtool.toMeasurement(annotation);
  },
  matchingCriteria: (annotation) => {
    const { CTRtool } = annotation.INTERNAL;
    return CTRtool.matchingCriteria(annotation);
  },
};

export default CTR;
