import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { LayoutSelector as OHIFLayoutSelector, ToolbarButton, LayoutPreset } from '@ohif/ui';
import { ServicesManager } from '@ohif/core';
import { windowLevelPresets } from '../../../../platform/core/src/defaults';

const defaultCommonPresets = [
  {
    icon: 'layout-common-1x1',
    commandOptions: {
      numRows: 1,
      numCols: 1,
    },
  },
  {
    icon: 'layout-common-1x2',
    commandOptions: {
      numRows: 1,
      numCols: 2,
    },
  },
  {
    icon: 'layout-common-2x2',
    commandOptions: {
      numRows: 2,
      numCols: 2,
    },
  },
  {
    icon: 'layout-common-2x3',
    commandOptions: {
      numRows: 2,
      numCols: 3,
    },
  },
  {
    icon: 'layout-common-2x3',
    commandOptions: {
      numRows: 2,
      numCols: 4,
    },
  },
];

const _areSelectorsValid = (hp, displaySets, hangingProtocolService) => {
  if (!hp.displaySetSelectors || Object.values(hp.displaySetSelectors).length === 0) {
    return true;
  }

  return hangingProtocolService.areRequiredSelectorsValid(
    Object.values(hp.displaySetSelectors),
    displaySets[0]
  );
};

const generateAdvancedPresets = ({ servicesManager }) => {
  const { hangingProtocolService, viewportGridService, displaySetService } =
    servicesManager.services;

  const hangingProtocols = Array.from(hangingProtocolService.protocols.values());

  const viewportId = viewportGridService.getActiveViewportId();

  if (!viewportId) {
    return [];
  }
  const displaySetInsaneUIDs = viewportGridService.getDisplaySetsUIDsForViewport(viewportId);

  const displaySets = displaySetInsaneUIDs.map(uid => displaySetService.getDisplaySetByUID(uid));

  return hangingProtocols
    .map(hp => {
      if (!hp.isPreset) {
        return null;
      }

      const areValid = _areSelectorsValid(hp, displaySets, hangingProtocolService);

      return {
        icon: hp.icon,
        title: hp.name,
        commandOptions: {
          protocolId: hp.id,
        },
        disabled: !areValid,
      };
    })
    .filter(preset => preset !== null);
};

function ToolbarLayoutSelectorWithServices({ commandsManager, servicesManager, ...props }) {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleMouseEnter = () => {
    setIsDisabled(false);
  };

  const onSelection = useCallback(props => {
    commandsManager.run({
      commandName: 'setViewportGridLayout',
      commandOptions: { ...props },
    });
    setIsDisabled(true);
  }, []);

  const onSelectionPreset = useCallback(props => {
    const { hangingProtocolService, viewportGridService, displaySetService } =
      servicesManager.services;

    const { currentStudy, currentSeries } = window;
    const displaySets = displaySetService.getDisplaySetsForSeries(currentSeries);
    if (window.volumeLoadInfo && window.volumeLoadInfo[currentStudy]) {
      window.volumeLoadInfo[currentStudy][currentSeries] = {
        startTime: Date.now(),
        total: (displaySets[0]?.instances || []).length
      }
    } else {
      window.volumeLoadInfo[currentStudy] = {
        [currentSeries]: {
          startTime: Date.now()
        }
      }
    }

    commandsManager.run({
      commandName: 'setHangingProtocol',
      commandOptions: { ...props },
    });
    setIsDisabled(true);
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {//
  //     const { displaySetService } = servicesManager.services;

  //     const displaySets = displaySetService.getActiveDisplaySets();

  //     const displaySet = displaySets[0];
  //     const instance = displaySet?.instances?.[0] || displaySet?.instance;


  //     const body_part = instance?.BodyPartExamined;
  //     const modality = instance?.Modality;
  //     // console.log("Layout useffect", body_part);

  //     if (modality === 'CT' && body_part.includes('HEAD')) {
  //       setPrimaryAxial();
  //     } else if (modality === 'CT' && body_part.includes('ABDOMEN')) {
  //       // setTwoByFour(instance);
  //       setCTAbdomen();
  //     }
  //   }, 2500);
  //   // setActiveProtocolIds
  // }, []);

  const setCTAbdomen = () => {
    // onSelectionPreset({ protocolId: 'ctAbdomen' });
    setTimeout(() => {
      commandsManager.run({
        commandName: 'setWindowLevelForAll',
        commandOptions: windowLevelPresets[1],
        label: 'W/L Preset 1',
        keys: ['1'],
      })
    }, 1500)
  }

  return (
    <div onMouseEnter={handleMouseEnter}>
      <LayoutSelector
        {...props}
        onSelection={onSelection}
        onSelectionPreset={onSelectionPreset}
        servicesManager={servicesManager}
        tooltipDisabled={isDisabled}
      />
    </div>
  );
}

function LayoutSelector({
  rows,
  columns,
  className,
  onSelection,
  onSelectionPreset,
  servicesManager,
  tooltipDisabled,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { customizationService } = servicesManager.services;
  const commonPresets = customizationService.get('commonPresets') || defaultCommonPresets;
  const advancedPresets =
    customizationService.get('advancedPresets') || generateAdvancedPresets({ servicesManager });

  const closeOnOutsideClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', closeOnOutsideClick);
    return () => {
      window.removeEventListener('click', closeOnOutsideClick);
    };
  }, [isOpen]);

  const onInteractionHandler = () => {
    setIsOpen(!isOpen);
  };
  const DropdownContent = isOpen ? OHIFLayoutSelector : null;

  return (
    <ToolbarButton
      id="Layout"
      label="Layout"
      icon="tool-layout"
      onInteraction={onInteractionHandler}
      className={className}
      rounded={rest.rounded}
      disableToolTip={tooltipDisabled}
      dropdownContent={
        DropdownContent !== null && (
          <div className="flex ">
            <div className="bg-secondary-dark flex flex-col gap-2.5 p-2">
              <div className="text-aqua-pale text-xs">Common</div>

              <div className="flex gap-4">
                {commonPresets.map((preset, index) => (
                  <LayoutPreset
                    key={index}
                    classNames="hover:bg-primary-dark group p-1 cursor-pointer"
                    icon={preset.icon}
                    commandOptions={preset.commandOptions}
                    onSelection={onSelection}
                  />
                ))}
              </div>

              <div className="h-[2px] bg-black"></div>

              <div className="text-aqua-pale text-xs">Advanced</div>

              <div className="flex flex-col gap-2.5">
                {advancedPresets.map((preset, index) => (
                  <LayoutPreset
                    key={index + commonPresets.length}
                    classNames="hover:bg-primary-dark group flex gap-2 p-1 cursor-pointer"
                    icon={preset.icon}
                    title={preset.title}
                    disabled={preset.disabled}
                    commandOptions={preset.commandOptions}
                    onSelection={onSelectionPreset}
                  />
                ))}
              </div>
            </div>

            <div className="bg-primary-dark flex flex-col gap-2.5 border-l-2 border-solid border-black  p-2">
              <div className="text-aqua-pale text-xs">Custom</div>
              <DropdownContent
                rows={rows}
                columns={columns}
                onSelection={onSelection}
              />
              <p className="text-aqua-pale text-xs leading-tight">
                Hover to select <br></br>rows and columns <br></br> Click to apply
              </p>
            </div>
          </div>
        )
      }
      isActive={isOpen}
      type="toggle"
    />
  );
}

LayoutSelector.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  onLayoutChange: PropTypes.func,
  servicesManager: PropTypes.instanceOf(ServicesManager),
};

LayoutSelector.defaultProps = {
  columns: 4,
  rows: 3,
  onLayoutChange: () => { },
};

export default ToolbarLayoutSelectorWithServices;
