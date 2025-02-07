import { getEnabledElement, utilities } from '@cornerstonejs/core';
import { BaseTool } from '@cornerstonejs/tools';
import {
  utilities as cstUtils,
  ReferenceLinesTool,
} from '@cornerstonejs/tools';

/**
 * The StackScrollMouseWheelTool is a tool that allows the user to scroll through a
 * stack of images using the mouse wheel
 */
class StackScrollMouseWheelTool extends BaseTool {
  static toolName;
  _configuration: any;
  servicesManager: any;

  constructor(
    defaultToolProps = {
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        invert: false,
        debounceIfNotLoaded: true,
        loop: false,
        scrollSlabs: false,
        toolProps: {},
      },
    }
  ) {
    const { toolProps } = defaultToolProps.configuration;
    super(toolProps, defaultToolProps);
    // Get the services manager from the toolProps
    this.servicesManager = toolProps?.servicesManager;
  }

  mouseWheelCallback(evt): void {
    const { wheel, element } = evt.detail;
    const { direction } = wheel;
    const { invert } = this.configuration;
    const { viewport } = getEnabledElement(element);
    const delta = direction * (invert ? -1 : 1);

    const targetId = this.getTargetId(viewport);
    const volumeId = utilities.getVolumeId(targetId);

    // Get services from the manager
    const {
      displaySetService,
      viewportGridService,
      cornerstoneViewportService,
    } = this.servicesManager.services;

    // Get current image index and total images in current series
    const currentImageId = viewport?.csImage?.imageId;
    const imageIds = viewport?.imageIds;
    const totalImages = imageIds?.length;
    const currentIndex = imageIds?.indexOf(currentImageId);

    // Check if we're at the end of the series
    const isLastImage = currentIndex === totalImages - 1 && direction > 0;
    const isFirstImage = currentIndex === 0 && direction < 0;

    // Check if series scroll is enabled from the configuration
    const isSeriesScrollEnabled = this.configuration.seriesScrollEnabled ?? true;

    if ((isLastImage || isFirstImage) && isSeriesScrollEnabled) {
      // Get all displaySets from the displaySetService
      const displaySets = displaySetService.getActiveDisplaySets()?.sort((a, b) => a.SeriesNumber - b.SeriesNumber);

      // Find the current displaySet
      const currentDisplaySetUID = viewportGridService?.getDisplaySetsUIDsForViewport(viewport.id);

      const currentDisplaySetIndex = displaySets.findIndex(
        ds => ds.displaySetInstanceUID === currentDisplaySetUID?.[0]
      );

      if (currentDisplaySetIndex === -1) {
        console.warn('Current display set not found');
        return;
      }

      // Calculate the next displaySet index
      const nextIndex = (currentDisplaySetIndex + direction + displaySets.length) % displaySets.length;
      const nextDisplaySet = displaySets[nextIndex];

      if (!nextDisplaySet) {
        console.warn('No next display set found');
        return;
      }

      // Update the viewport with the new displaySet
      const viewportId = viewport.id;

      // Set the displaySet for the current viewport
      viewportGridService.setDisplaySetsForViewport({
        viewportId,
        displaySetInstanceUIDs: [nextDisplaySet.displaySetInstanceUID],
      });

      // Jump to first/last image based on scroll direction
      const targetIndex = direction > 0 ? 0 : nextDisplaySet.images.length - 1;

      // Wait for the viewport to be ready with new displaySet
      setTimeout(() => {
        const updatedViewport = cornerstoneViewportService.getCornerstoneViewport(viewportId);
        if (updatedViewport) {
          cstUtils.jumpToSlice(updatedViewport.element, { imageIndex: targetIndex });
        }
      }, 100);

    } else {
      cstUtils.scroll(viewport, {
        delta,
        debounceLoading: this.configuration.debounceIfNotLoaded,
        loop: this.configuration.loop,
        volumeId,
        scrollSlabs: this.configuration.scrollSlabs,
      });
    }
  }

  // Add method to update series scroll state
  setSeriesScrollEnabled(enabled: boolean): void {
    this.configuration.seriesScrollEnabled = enabled;
  }
}

StackScrollMouseWheelTool.toolName = 'StackScrollMouseWheel';
export default StackScrollMouseWheelTool;
