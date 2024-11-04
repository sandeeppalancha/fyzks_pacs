export const ctAbdomen = {
  // id: 'default',
  id: 'ctComparision',
  locked: true,
  name: 'CT Abdomen',
  icon: 'layout-advanced-axial-primary',
  isPreset: true,
  createdDate: '2024-09-15T10:29:44.894Z',
  modifiedDate: '2024-09-15T10:29:44.894Z',
  availableTo: {},
  editableBy: {},
  protocolMatchingRules: [],
  imageLoadStrategy: 'interleaveCenter',
  displaySetSelectors: {
    priormprDisplaySetCT: {
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
          weight: 1,
          attribute: 'isReconstructable',
          constraint: {
            equals: {
              value: true,
            },
          },
          required: true,
        },
        // {
        //   weight: 1,
        //   attribute: 'prior_study',
        //   constraint: {
        //     equals: {
        //       value: true,
        //     },
        //   },
        //   required: false,
        // },
      ],
    },
    mprDisplaySetCT: {
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
          weight: 1,
          attribute: 'isReconstructable',
          constraint: {
            equals: {
              value: true,
            },
          },
          required: false,
        },
      ],
    },
  },
  stages: [
    {
      id: 'ctAbdomenStage',
      name: 'ctAbdomen',
      viewportStructure: {
        layoutType: 'grid',
        properties: {
          rows: 2,
          columns: 3,
          // layoutOptions: [
          //   {
          //     x: 0,
          //     y: 0,
          //     width: 2 / 3,
          //     height: 1,
          //   },
          //   {
          //     x: 2 / 3,
          //     y: 0,
          //     width: 1 / 3,
          //     height: 1 / 2,
          //   },
          //   {
          //     x: 2 / 3,
          //     y: 1 / 2,
          //     width: 1 / 3,
          //     height: 1 / 2,
          //   },
          // ],
        },
      },
      viewports: [
        {
          viewportOptions: {
            viewportId: 'current-axial',
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
              id: 'mprDisplaySetCT',
            },
          ],
        },
        {
          viewportOptions: {
            id: 'current-sagittal',
            viewportId: 'current-sagittal',
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
              id: 'mprDisplaySetCT',
            },
          ],
        },
        {
          viewportOptions: {
            viewportId: 'current-coronal',
            id: 'current-coronal',
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
              id: 'mprDisplaySetCT',
            },
          ],
        },
        // {
        //   viewportOptions: {
        //     toolGroupId: 'mpr',
        //     viewportId: 'current-empty',
        //     // viewportType: 'volume',
        //     // orientation: 'coronal',
        //     initialImageOptions: {
        //       preset: 'middle',
        //     },
        //     syncGroups: [
        //       {
        //         type: 'voi',
        //         id: 'mpr',
        //         source: true,
        //         target: true,
        //         options: {
        //           syncColormap: true,
        //         },
        //       },
        //     ],
        //   },
        //   displaySets: [
        //     // {
        //     //   id: 'priormprDisplaySetCT',
        //     // },
        //   ],
        // },
        {
          comparisionStudy: true,
          viewportOptions: {
            id: 'prior-axial',
            viewportId: 'prior-axial',
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
              id: 'priormprDisplaySetCT',
            },
          ],
        },
        {
          comparisionStudy: true,
          viewportOptions: {
            id: 'prior-sagittal',
            viewportId: 'prior-sagittal',
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
              id: 'priormprDisplaySetCT',
            },
          ],
        },
        {
          comparisionStudy: true,

          viewportOptions: {
            id: 'prior-coronal',
            viewportId: 'prior-coronal',
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
              id: 'priormprDisplaySetCT',
            },
          ],
        },
        {
          comparisionStudy: true,
          viewportOptions: {
            toolGroupId: 'mpr',
            // viewportType: 'volume',
            // orientation: 'coronal',

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
          // displaySets: [
          // {
          //   id: 'mprDisplaySetCT',
          // },
          // ],
        },
      ],
    },
  ],
};
