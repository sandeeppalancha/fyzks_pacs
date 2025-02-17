// extensions/cornerstone/src/tools/SyncTools/index.ts

export const SYNC_BUTTON = {
  id: 'SyncGroup',
  type: 'ohif.splitButton',
  props: {
    type: 'tool',
    icon: 'tool-sync',
    label: 'Sync',
    groupId: 'SyncGroup',
    primary: {
      id: 'NoSync',
      label: 'No Sync',
      icon: 'tool-sync',
      type: 'tool',
      commands: [
        {
          commandName: 'toggleSync',
          commandOptions: {
            type: 'imageSlice',
            enabled: false,
          },
        },
      ],
    },
    items: [
      {
        id: 'NoSync',
        label: 'No Sync',
        icon: 'tool-sync',
        type: 'tool',
        commands: [
          {
            commandName: 'toggleSync',
            commandOptions: {
              type: 'imageSlice',
              enabled: false,
            },
          },
        ],
      },
      {
        id: 'AutoSync',
        label: 'Auto Sync',
        icon: 'tool-sync',
        type: 'tool',
        commands: [
          {
            commandName: 'toggleSync',
            commandOptions: {
              type: 'imageSlice',
              enabled: true,
            },
          },
        ],
      }
    ],
    evaluate: 'evaluate.cornerstone.synchronizer'
  },
};
