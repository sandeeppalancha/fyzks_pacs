import { Enums } from '@cornerstonejs/tools';

const toolGroupIds = {
  CT: 'ctToolGroup',
  default: 'default',
  mpr: 'mpr',
};

function createTools(toolNames) {
  return {
    active: [
      {
        toolName: toolNames.WindowLevel,
        bindings: [{ mouseButton: Enums.MouseBindings.Primary }],
      },
      {
        toolName: toolNames.Pan,
        bindings: [{ mouseButton: Enums.MouseBindings.Auxiliary }],
      },
      {
        toolName: toolNames.Zoom,
        bindings: [{ mouseButton: Enums.MouseBindings.Secondary }],
      },
      { toolName: toolNames.StackScrollMouseWheel, bindings: [] },
    ],
    passive: [
      { toolName: toolNames.Length },
      { toolName: toolNames.Probe },
      { toolName: toolNames.EllipticalROI },
      { toolName: toolNames.RectangleROI },
      { toolName: toolNames.StackScroll },
      { toolName: toolNames.Crosshairs },
    ],
  };
}

function initDefaultToolGroup(extensionManager, toolNames) {
  const { ToolGroupManager } = extensionManager.getModuleEntry(
    '@ohif/extension-cornerstone.services.toolGroupService'
  );

  const toolGroup = ToolGroupManager.createToolGroup(toolGroupIds.default);

  const tools = createTools(toolNames);

  tools.active.forEach(tool => {
    toolGroup.addTool(tool.toolName, {
      bindings: tool.bindings,
    });
  });

  tools.passive.forEach(tool => {
    toolGroup.addTool(tool.toolName);
  });

  toolGroup.setToolActive(tools.active[0].toolName, {
    bindings: tools.active[0].bindings,
  });

  return toolGroup;
}

function initSRToolGroup(extensionManager, toolGroupService) {
  const SRUtilityModule = extensionManager.getModuleEntry(
    '@ohif/extension-cornerstone-dicom-sr.utilityModule.tools'
  );

  if (!SRUtilityModule) {
    return;
  }

  const CS3DUtilityModule = extensionManager.getModuleEntry(
    '@ohif/extension-cornerstone.utilityModule.tools'
  );

  const { toolNames: SRToolNames } = SRUtilityModule.exports;
  const { toolNames, Enums } = CS3DUtilityModule.exports;
  const tools = {
    active: [
      {
        toolName: toolNames.WindowLevel,
        bindings: [
          {
            mouseButton: Enums.MouseBindings.Primary,
          },
        ],
      },
      {
        toolName: toolNames.Pan,
        bindings: [
          {
            mouseButton: Enums.MouseBindings.Auxiliary,
          },
        ],
      },
      {
        toolName: toolNames.Zoom,
        bindings: [
          {
            mouseButton: Enums.MouseBindings.Secondary,
          },
        ],
      },
      {
        toolName: toolNames.StackScrollMouseWheel,
        bindings: [],
      },
    ],
    passive: [
      { toolName: SRToolNames.SRLength },
      { toolName: SRToolNames.SRArrowAnnotate },
      { toolName: SRToolNames.SRBidirectional },
      { toolName: SRToolNames.SREllipticalROI },
      { toolName: SRToolNames.SRCircleROI },
      { toolName: SRToolNames.SRPlanarFreehandROI },
      { toolName: SRToolNames.SRRectangleROI },
    ],
    enabled: [
      {
        toolName: SRToolNames.DICOMSRDisplay,
        bindings: [],
      },
    ],
    // disabled
  };

  const toolGroupId = 'SRToolGroup';
  toolGroupService.createToolGroupAndAddTools(toolGroupId, tools);
}

function initMPRToolGroup(extensionManager, toolGroupService, commandsManager, modeLabelConfig) {
  const utilityModule = extensionManager.getModuleEntry(
    '@ohif/extension-cornerstone.utilityModule.tools'
  );

  const { toolNames, Enums } = utilityModule.exports;

  const tools = {
    active: [
      {
        toolName: toolNames.WindowLevel,
        bindings: [{ mouseButton: Enums.MouseBindings.Primary }],
      },
      {
        toolName: toolNames.Pan,
        bindings: [{ mouseButton: Enums.MouseBindings.Auxiliary }],
      },
      {
        toolName: toolNames.Zoom,
        bindings: [{ mouseButton: Enums.MouseBindings.Secondary }],
      },
      { toolName: toolNames.StackScrollMouseWheel, bindings: [] },
    ],
    passive: [
      { toolName: toolNames.Length },
      {
        toolName: toolNames.ArrowAnnotate,
        configuration: {
          getTextCallback: (callback, eventDetails) => {
            if (modeLabelConfig) {
              callback('');
            } else {
              commandsManager.runCommand('arrowTextCallback', {
                callback,
                eventDetails,
              });
            }
          },
          changeTextCallback: (data, eventDetails, callback) => {
            if (modeLabelConfig === undefined) {
              commandsManager.runCommand('arrowTextCallback', {
                callback,
                data,
                eventDetails,
              });
            }
          },
        },
      },
      { toolName: toolNames.Bidirectional },
      { toolName: toolNames.DragProbe },
      { toolName: toolNames.Probe },
      { toolName: toolNames.EllipticalROI },
      { toolName: toolNames.CircleROI },
      { toolName: toolNames.RectangleROI },
      { toolName: toolNames.StackScroll },
      { toolName: toolNames.Angle },
      { toolName: toolNames.CobbAngle },
      { toolName: toolNames.PlanarFreehandROI },
      { toolName: toolNames.SegmentationDisplay },
      { toolName: toolNames.CTR },
    ],
    disabled: [
      {
        toolName: toolNames.Crosshairs,
        configuration: {
          viewportIndicators: false,
          disableOnPassive: true,
          autoPan: {
            enabled: false,
            panSize: 10,
          },
        },
      },
      {
        toolName: toolNames.AdvancedMagnify,
      },
      { toolName: toolNames.ReferenceLines },
    ],
  };

  toolGroupService.createToolGroupAndAddTools('mpr', tools);
}

function initVolume3DToolGroup(extensionManager, toolGroupService) {
  const utilityModule = extensionManager.getModuleEntry(
    '@ohif/extension-cornerstone.utilityModule.tools'
  );

  const { toolNames, Enums } = utilityModule.exports;

  const tools = {
    active: [
      {
        toolName: toolNames.TrackballRotateTool,
        bindings: [{ mouseButton: Enums.MouseBindings.Primary }],
      },
      {
        toolName: toolNames.Zoom,
        bindings: [{ mouseButton: Enums.MouseBindings.Secondary }],
      },
      {
        toolName: toolNames.Pan,
        bindings: [{ mouseButton: Enums.MouseBindings.Auxiliary }],
      },
    ],
  };

  toolGroupService.createToolGroupAndAddTools('volume3d', tools);
}

export default function initToolGroups(extensionManager, commandsManager, servicesManager) {
  const toolNames = {
    WindowLevel: 'WindowLevel',
    Pan: 'Pan', 
    Zoom: 'Zoom',
    StackScrollMouseWheel: 'StackScrollMouseWheel',
    Length: 'Length',
    Probe: 'Probe',
    EllipticalROI: 'EllipticalROI', 
    RectangleROI: 'RectangleROI',
    StackScroll: 'StackScroll',
    Crosshairs: 'Crosshairs',
    ArrowAnnotate: 'ArrowAnnotate',
    Bidirectional: 'Bidirectional',
    DragProbe: 'DragProbe',
    Angle: 'Angle',
    CobbAngle: 'CobbAngle',
    PlanarFreehandROI: 'PlanarFreehandROI',
    SegmentationDisplay: 'SegmentationDisplay',
    CTR: 'CTR',
    AdvancedMagnify: 'AdvancedMagnify',
    ReferenceLines: 'ReferenceLines',
    TrackballRotateTool: 'TrackballRotateTool'
  };

  initDefaultToolGroup(extensionManager, toolNames);
  initSRToolGroup(extensionManager, servicesManager);
  initMPRToolGroup(extensionManager, servicesManager, commandsManager);
  initVolume3DToolGroup(extensionManager, servicesManager);
}