import { hotkeys } from '@ohif/core';
import toolbarButtons from './toolbarButtons';
import initToolGroups from './initToolGroups';
import i18n from 'i18next';
import { id } from './id';
import moreTools from './moreTools';


const ohif = {
  layout: '@ohif/extension-default.layoutTemplateModule.viewerLayout',
  sopClassHandler: '@ohif/extension-default.sopClassHandlerModule.stack',
  hangingProtocol: '@ohif/extension-default.hangingProtocolModule.default',
  leftPanel: '@ohif/extension-default.panelModule.seriesList',
  rightPanel: '@ohif/extension-default.panelModule.measure',
};

const mode = {
  id: 'viewer',
  modeFactory: ({ modeConfiguration }) => {
    return {
      id: 'viewer',
      routes: [
        {
          path: 'viewer',
          layoutTemplate: ({ location, servicesManager }) => {
            return {
              id: ohif.layout,
              props: {
                leftPanels: [ohif.leftPanel],
                rightPanels: [ohif.rightPanel],
                viewports: [
                  {
                    namespace: '@ohif/extension-cornerstone.viewportModule.cornerstone',
                    displaySetsToDisplay: [ohif.sopClassHandler],
                  },
                ],
              },
            };
          },
        },
      ],
      extensions: [
        '@ohif/extension-default',
        '@ohif/extension-cornerstone',
      ],
      hangingProtocol: '@ohif/hp-comparison',
      sopClassHandlers: [ohif.sopClassHandler],
      hotkeys: [...hotkeys.defaults.hotkeyBindings],
      ...modeConfiguration,
    };
  },
  routes: [
    {
      path: 'viewer',
      init: ({ servicesManager, extensionManager }) => {
        const { toolGroupService, hangingProtocolService } = servicesManager.services;

        initToolGroups(extensionManager, toolGroupService);

        // Configure comparison protocol
        hangingProtocolService.addProtocol('@ohif/hp-comparison', {
          id: '@ohif/hp-comparison',
          hasUpdatedPriorsInformation: true,
          name: 'Compare Studies',
          numberOfPriorsReferenced: -1,
          protocolMatchingRules: [
            {
              attribute: 'StudyInstanceUID',
              constraint: {
                notNull: true,
              },
            },
          ],
          stages: [
            {
              id: 'comparison',
              viewportStructure: {
                type: 'grid',
                properties: {
                  rows: 1,
                  columns: 2,
                },
              },
              viewports: [
                {
                  viewportOptions: {
                    viewportType: 'stack',
                    sync: true,
                  },
                  displaySets: [
                    {
                      id: 'currentStudy',
                      matchedDisplaySetsIndex: -1,
                    },
                  ],
                },
                {
                  viewportOptions: {
                    viewportType: 'stack',
                    sync: true,
                  },
                  displaySets: [
                    {
                      id: 'priorStudy',
                      matchedDisplaySetsIndex: -1, 
                    },
                  ],
                },
              ],
            },
          ],
        });
      },
    },
  ],
};

export default mode;