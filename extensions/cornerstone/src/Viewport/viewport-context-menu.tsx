import * as cs3DTools from '@cornerstonejs/tools';
import { getEnabledElement, StackViewport } from '@cornerstonejs/core';

// Add state management for overlay visibility with a global Map to track per-viewport state
const overlayVisibilityState = new Map();

const createContextMenu = async (element, event, viewportId) => {
  // Check if there's a tool near the click point
  const canvasPos = getCanvasPoint(event, element);

  try {
    // Get the annotation manager
    const annotationManager = cs3DTools.annotation.state.getAnnotationManager();

    // Get all annotations
    const annotations = annotationManager.getAllAnnotations();

    // Check if any annotation is near the click point
    const isNearAnnotation = annotations.some(annotation => {
      // Get the points from the handles
      const points = annotation.data?.handles?.points;
      if (!Array.isArray(points)) return false;

      // Check each point's position against click position
      return points.some(point => {
        if (!Array.isArray(point) || point.length < 2) return false;

        // Convert 3D point to canvas coordinates
        const enabledElement = getEnabledElement(element);
        if (!enabledElement?.viewport) return false;

        // Get the viewport camera and convert world coordinates to canvas
        const viewport = enabledElement.viewport;
        const canvasPoint = viewport.worldToCanvas(point);

        if (!canvasPoint) return false;

        const dx = canvasPoint[0] - canvasPos.x;
        const dy = canvasPoint[1] - canvasPos.y;

        // Consider it "near" if within 15 pixels
        return Math.sqrt(dx * dx + dy * dy) < 15;
      });
    });

    // If near an annotation, let default handler work
    if (isNearAnnotation) {
      return;
    }
  } catch (error) {
    console.warn('Error checking for nearby annotations:', error);
  }

  // If we get here, there's no nearby annotation, so show our custom menu
  event.preventDefault();

  const existingMenu = document.getElementById('cornerstoneContextMenu');
  if (existingMenu) {
    existingMenu.remove();
  }

  const menu = document.createElement('div');
  menu.id = 'cornerstoneContextMenu';
  menu.className = 'absolute bg-primary-dark shadow-lg rounded py-1 z-50';
  menu.style.left = `${event.clientX}px`;
  menu.style.top = `${event.clientY}px`;

  // Initialize visibility state for this viewport if not exists
  if (!overlayVisibilityState.has(viewportId)) {
    overlayVisibilityState.set(viewportId, true);
  }

  // Create menu items array
  const menuItems = [
    {
      label: 'Navigate Images',
      submenu: [
        {
          label: 'First Image',
          onClick: () => handleGoToImage(element, 'first')
        },
        {
          label: 'Last Image',
          onClick: () => handleGoToImage(element, 'last')
        }
      ]
    },
    {
      label: 'Switch Series',
      submenu: await getAvailableSeries(element)
    },
    {
      label: `${overlayVisibilityState.get(viewportId) ? 'Hide' : 'Show'} Overlay`,
      onClick: () => toggleOverlay(element, viewportId)
    },
    {
      label: 'Export Image',
      submenu: [
        {
          label: 'Export as PNG',
          onClick: () => exportViewportImage(element, 'png')
        },
        {
          label: 'Export as JPEG',
          onClick: () => exportViewportImage(element, 'jpeg')
        }
      ]
    }
  ];

  // Create menu items
  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'group relative px-3 py-1 text-white text-sm cursor-pointer';

    if (item.submenu) {
      // Create item with submenu
      menuItem.innerHTML = `
        ${item.label}
        <span class="float-right">▶</span>
      `;

      const submenu = document.createElement('div');
      submenu.className = 'absolute left-full top-0 bg-primary-dark shadow-lg rounded py-1 hidden group-hover:block';
      submenu.style.marginLeft = '1px';
      submenu.style.maxHeight = '400px';
      submenu.style.overflowY = 'auto';

      item.submenu.forEach(subItem => {
        const submenuItem = document.createElement('div');
        submenuItem.className = 'px-3 py-1 hover:bg-primary-light text-white text-sm cursor-pointer whitespace-nowrap transition-colors duration-200';
        submenuItem.textContent = subItem.label;
        submenuItem.onclick = () => {
          subItem.onClick();
          menu.remove();
        };
        submenu.appendChild(submenuItem);
      });

      menuItem.appendChild(submenu);
    } else {
      // Create simple menu item
      menuItem.textContent = item.label;
      menuItem.onclick = () => {
        item.onClick();
        menu.remove();
      };
    }

    menu.appendChild(menuItem);
  });

  const closeMenu = (e) => {
    if (!menu.contains(e.target)) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  };

  document.addEventListener('click', closeMenu);
  document.body.appendChild(menu);
};

const getCanvasPoint = (event, element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

const handleGoToImage = (element, position) => {
  const enabledElement = getEnabledElement(element);
  if (!enabledElement) return;

  const viewport = enabledElement.viewport;

  if (viewport instanceof StackViewport) {
    const imageIds = viewport.getImageIds();
    const targetIndex = position === 'first' ? 0 : imageIds.length - 1;

    cs3DTools.utilities.jumpToSlice(element, {
      imageIndex: targetIndex,
    });
  }
};

const exportViewportImage = async (element, format = 'png') => {
  try {
    const enabledElement = getEnabledElement(element);
    if (!enabledElement?.viewport) {
      console.warn('No enabled element found');
      return;
    }

    // Get the canvas element from the viewport
    const canvas = element.querySelector('canvas');
    if (!canvas) {
      console.warn('No canvas element found');
      return;
    }

    // Create a temporary link element
    const link = document.createElement('a');

    // Set the file format and mime type
    const mimeType = `image/${format}`;
    const quality = format === 'jpeg' ? 0.92 : 1.0;

    // Convert canvas to data URL with specified format
    const dataUrl = canvas.toDataURL(mimeType, quality);

    // Set up the download
    link.href = dataUrl;
    link.download = `viewport-image.${format}`;

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting image:', error);
  }
};

const toggleOverlay = (element, viewportId) => {
  const currentState = overlayVisibilityState.get(viewportId);
  const newState = !currentState;
  overlayVisibilityState.set(viewportId, newState);

  // Find the viewport container using cornerstone viewport element
  const viewportContainer = document.querySelector(`.cornerstone-viewport-element[data-viewport-uid="${viewportId}"]`);
  if (!viewportContainer) {
    console.warn('Viewport container not found');
    return;
  }

  // Find all overlay items in the viewport's parent container
  const viewportParent = viewportContainer.parentElement;
  if (!viewportParent) {
    console.warn('Viewport parent not found');
    return;
  }

  // Find the ViewportOverlay component that's a sibling to the viewport
  const overlayElements = viewportParent.querySelectorAll('.ViewportOverlay, .overlay-item');
  overlayElements.forEach(element => {
    element.style.display = newState ? '' : 'none'; // Use empty string to restore default display value
  });
};

// Function to get available series from the displaySetService
const getAvailableSeries = async (element) => {
  const services = window?.services;
  const displaySetService = services?.displaySetService;
  const hangingProtocolService = services?.hangingProtocolService;
  const viewportGridService = services?.viewportGridService;
  const uiNotificationService = services?.uiNotificationService;

  if (!displaySetService || !hangingProtocolService || !viewportGridService) {
    console.warn('Required services not found');
    return [];
  }

  const displaySets = displaySetService.getActiveDisplaySets();
  const viewportId = element.closest('[data-viewport-uid]').dataset.viewportUid;

  return displaySets.map((displaySet, index) => ({
    label: `${displaySet.SeriesNumber || index + 1}: ${displaySet.SeriesDescription || 'No description'}`,
    onClick: () => {
      let updatedViewports = [];

      try {
        updatedViewports = hangingProtocolService.getViewportsRequireUpdate(
          viewportId,
          displaySet.displaySetInstanceUID
        );
      } catch (error) {
        console.warn(error);
        uiNotificationService?.show({
          title: 'Series Switch',
          message:
            'The selected display sets could not be added to the viewport due to a mismatch in the Hanging Protocol rules.',
          type: 'info',
          duration: 3000,
        });
        return;
      }

      viewportGridService.setDisplaySetsForViewports(updatedViewports);
    }
  }));
};

// Add styles to document
const style = document.createElement('style');
style.textContent = `
  #cornerstoneContextMenu {
    min-width: 160px;
    background-color: #151515;
    border: 1px solid #2c3c57;
    user-select: none;
  }
  #cornerstoneContextMenu div {
    font-size: 13px;
    font-family: Inter, sans-serif;
  }
  #cornerstoneContextMenu .group:hover {
    background-color: #2c3c57;
  }
  #cornerstoneContextMenu .group > div {
    min-width: 140px;
    border: 1px solid #2c3c57;
    max-height: 400px;
    overflow-y: auto;
  }
`;
document.head.appendChild(style);

export const initializeContextMenu = (elementRef, viewportId) => {
  const element = elementRef.current;
  if (!element) return;

  element.addEventListener('contextmenu', (e) => {
    createContextMenu(element, e, viewportId);
  });
};
