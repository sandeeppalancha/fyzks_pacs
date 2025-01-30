// navigationMenuItems.ts
import { Types } from '@ohif/core';
import { utilities } from '@cornerstonejs/tools';
import { getEnabledElement, StackViewport } from '@cornerstonejs/core';

export const getNavigationMenuConfig = () => {
  return {
    id: 'navigationMenu',
    menus: {
      navigationMenu: {
        items: [
          {
            label: 'First Image',
            commands: [
              {
                commandName: 'jumpToFirstImage',
                commandOptions: {},
                context: 'DEFAULT',
              },
            ],
          },
          {
            label: 'Last Image',
            commands: [
              {
                commandName: 'jumpToLastImage',
                commandOptions: {},
                context: 'DEFAULT',
              },
            ],
          },
        ],
      },
    },
  };
};

export const getNavigationCommands = () => {
  return {
    jumpToFirstImage: {
      commandFn: ({ element }) => {
        const enabledElement = getEnabledElement(element);
        if (!enabledElement?.viewport || !(enabledElement.viewport instanceof StackViewport)) {
          return;
        }

        const viewport = enabledElement.viewport;
        const imageIds = viewport.getImageIds();

        utilities.jumpToSlice(element, {
          imageIndex: 0,
        });
      },
      context: 'DEFAULT',
    },
    jumpToLastImage: {
      commandFn: ({ element }) => {
        const enabledElement = getEnabledElement(element);
        if (!enabledElement?.viewport || !(enabledElement.viewport instanceof StackViewport)) {
          return;
        }

        const viewport = enabledElement.viewport;
        const imageIds = viewport.getImageIds();

        utilities.jumpToSlice(element, {
          imageIndex: imageIds.length - 1,
        });
      },
      context: 'DEFAULT',
    },
  };
};
