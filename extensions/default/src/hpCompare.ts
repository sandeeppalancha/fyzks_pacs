import { Types } from '@ohif/core';

const defaultDisplaySetSelector = {
  studyMatchingRules: [
    {
      attribute: 'studyInstanceUIDsIndex',
      from: 'options',
      required: true,
      constraint: {
        equals: { value: 0 },
      },
    },
  ],
  seriesMatchingRules: [
    {
      attribute: 'numImageFrames',
      constraint: {
        greaterThan: { value: 0 },
      },
    },
    {
      attribute: 'isDisplaySetFromUrl',
      // weight: 10,
      constraint: {
        equals: true,
      },
    },
    {
      attribute: 'isReconstructible',
      weight: 1,
      constraint: {
        equals: true,
      },
    },
  ],
};

const priorDisplaySetSelector = {
  studyMatchingRules: [
    {
      attribute: 'studyInstanceUIDsIndex',
      from: 'options',
      required: true,
      constraint: {
        equals: { value: 1 },
      },
    },
  ],
  seriesMatchingRules: [
    {
      attribute: 'numImageFrames',
      constraint: {
        greaterThan: { value: 0 },
      },
    },
    {
      attribute: 'isDisplaySetFromUrl',
      // weight: 10,
      constraint: {
        equals: true,
      },
    },
    {
      attribute: 'isReconstructible',
      weight: 1,
      constraint: {
        equals: true,
      },
    },
  ],
};

// Define display sets
const currentDisplaySet = {
  id: 'defaultDisplaySetId',
};

const priorDisplaySet = {
  id: 'priorDisplaySetId',
};

// Define foundational viewports
const currentViewport0 = {
  viewportOptions: {
    viewportType: 'volume',  // Assuming "mpr" type for MPR view
    toolGroupId: 'default',
    allowUnmatchedView: true,
  },
  displaySets: [currentDisplaySet],
};

const priorViewport0 = {
  viewportOptions: {
    viewportType: 'volume',
    toolGroupId: 'default',
    allowUnmatchedView: true,
  },
  displaySets: [priorDisplaySet],
};

// Define MPR views for current study
// const currentAxial = { ...currentViewport0, displaySets: [currentDisplaySet] };
const currentAxial = {
  viewportOptions: {
    viewportId: 'mpr-axial',
    toolGroupId: 'mpr',
    viewportType: 'stack',
    orientation: 'axial',
    initialImageOptions: {
      preset: 'middle',
    },
    // syncGroups: [
    //   {
    //     type: 'voi',
    //     id: 'mpr',
    //     source: true,
    //     target: true,
    //     options: {
    //       syncColormap: true,
    //     },
    //   },
    // ],
  },
  displaySets: [
    currentDisplaySet
  ],
}
// const currentCoronal = { ...currentViewport0, displaySets: [currentDisplaySet] };
const currentCoronal = {
  viewportOptions: {
    viewportId: 'mpr-sagittal',
    toolGroupId: 'mpr',
    viewportType: 'stack',
    orientation: 'sagittal',
    initialImageOptions: {
      preset: 'middle',
    },
    syncGroups: [
      {
        type: 'voi',
        id: 'mpr',
        source: true,
        target: true,
        options: {
          syncColormap: true,
        },
      },
    ],
  },
  displaySets: [

    currentDisplaySet

  ],
};

// const currentSagittal = { ...currentViewport0, displaySets: [currentDisplaySet] };

const currentSagittal = {
  viewportOptions: {
    viewportId: 'mpr-coronal',
    toolGroupId: 'mpr',
    viewportType: 'stack',
    orientation: 'coronal',
    initialImageOptions: {
      preset: 'middle',
    },
    syncGroups: [
      {
        type: 'voi',
        id: 'mpr',
        source: true,
        target: true,
        options: {
          syncColormap: true,
        },
      },
    ],
  },
  displaySets: [
    currentDisplaySet
  ],
};

// Define MPR views for prior study
const priorAxial = { ...priorViewport0, displaySets: [priorDisplaySet] };
const priorCoronal = { ...priorViewport0, displaySets: [priorDisplaySet] };
const priorSagittal = { ...priorViewport0, displaySets: [priorDisplaySet] };

const hpMNCompare: Types.HangingProtocol.Protocol = {
  id: '@ohif/hpCompare',
  description: 'Compare two studies in various layouts',
  name: 'Compare Two Studies',
  numberOfPriorsReferenced: 1,
  protocolMatchingRules: [
    {
      id: 'Two Studies',
      weight: 1000,
      attribute: 'StudyInstanceUID',
      from: 'prior',
      required: true,
      constraint: {
        notNull: true,
      },
    },
  ],
  toolGroupIds: ['default'],
  displaySetSelectors: {
    defaultDisplaySetId: defaultDisplaySetSelector,
    priorDisplaySetId: priorDisplaySetSelector,
  },
  // defaultViewport: {
  //   viewportOptions: {
  //     viewportType: 'stack',
  //     toolGroupId: 'default',
  //     allowUnmatchedView: true,
  //   },
  //   displaySets: [
  //     {
  //       id: 'defaultDisplaySetId',
  //       matchedDisplaySetsIndex: -1,
  //     },
  //   ],
  // },
  stages: [
    {
      name: '2x3',
      stageActivation: {
        enabled: {
          minViewportsMatched: 6,
        },
      },
      viewportStructure: {
        layoutType: 'grid',
        properties: {
          rows: 2,
          columns: 3,
          layoutOptions: [
            {
              x: 0,
              y: 0,
              width: 1 / 3,
              height: 1,
            },
            {
              x: 1 / 3,
              y: 0,
              width: 1 / 3,
              height: 1,
            },
            {
              x: 2 / 3,
              y: 0,
              width: 1 / 3,
              height: 1,
            },
          ],
        },
      },
      viewports: [
        {
          viewportOptions: {
            viewportId: 'mpr-axial',
            toolGroupId: 'mpr',
            viewportType: 'volume',
            orientation: 'axial',
            initialImageOptions: {
              preset: 'middle',
            },
            syncGroups: [
              {
                type: 'voi',
                id: 'mpr',
                source: true,
                target: true,
                options: {
                  syncColormap: true,
                },
              },
            ],
          },
          displaySets: [
            {
              id: 'defaultDisplaySetId',
            },
          ],
        },
        {
          viewportOptions: {
            viewportId: 'mpr-sagittal',
            toolGroupId: 'mpr',
            viewportType: 'volume',
            orientation: 'sagittal',
            initialImageOptions: {
              preset: 'middle',
            },
            syncGroups: [
              {
                type: 'voi',
                id: 'mpr',
                source: true,
                target: true,
                options: {
                  syncColormap: true,
                },
              },
            ],
          },
          displaySets: [
            {
              id: 'defaultDisplaySetId',
            },
          ],
        },
        {
          viewportOptions: {
            viewportId: 'mpr-coronal',
            toolGroupId: 'mpr',
            viewportType: 'volume',
            orientation: 'coronal',
            initialImageOptions: {
              preset: 'middle',
            },
            syncGroups: [
              {
                type: 'voi',
                id: 'mpr',
                source: true,
                target: true,
                options: {
                  syncColormap: true,
                },
              },
            ],
          },
          displaySets: [
            {
              id: 'defaultDisplaySetId',
            },
          ],
        },
      ],
    },
  ],
};

export default hpMNCompare;
