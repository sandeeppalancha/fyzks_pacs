export const ctAbdomen = {
  // id: 'default',
  id: 'ctAbdomen',
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
    mprDisplaySet: {
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
          columns: 4,
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
              id: 'mprDisplaySet',
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
              id: 'mprDisplaySet',
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
              id: 'mprDisplaySet',
            },
          ],
        },
        {
          viewportOptions: {
            toolGroupId: 'mpr',
            viewportId: 'current-empty',
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
          displaySets: [
            // {
            //   id: 'mprDisplaySet',
            // },
          ],
        },
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
              id: 'mprDisplaySet',
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
              id: 'mprDisplaySet',
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
              id: 'mprDisplaySet',
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
          displaySets: [
            // {
            //   id: 'mprDisplaySet',
            // },
          ],
        },
      ],
    },
  ],
};
