// src/tools/annotation/CTRAnnotation.ts
const CTRAnnotation = {
  toAnnotation: (measurement) => {
    const { points = [], ratio = 0 } = measurement;
    return {
      data: {
        handles: {
          points,
          activeHandleIndex: null,
          textBox: {
            hasMoved: false,
          },
        },
        ratio,
      },
    };
  },
  toMeasurement: (annotation) => {
    if (!annotation || !annotation.data || !annotation.data.handles) {
      return {};
    }
    return {
      points: annotation.data.handles.points || [],
      ratio: annotation.data.ratio || 0,
    };
  },
  schema: {
    properties: {
      handles: {
        properties: {
          points: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'number',
              },
            },
          },
          activeHandleIndex: {
            type: ['null', 'number'],
          },
          textBox: {
            type: 'object',
            properties: {
              hasMoved: {
                type: 'boolean',
              },
            },
          },
        },
        required: ['points'],
      },
      ratio: {
        type: 'number',
      },
    },
    required: ['handles', 'ratio'],
  },
};

export default CTRAnnotation;
