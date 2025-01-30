import * as cs3DTools from '@cornerstonejs/tools';
import { getEnabledElement, StackViewport } from '@cornerstonejs/core';

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

  // Create the main menu item with submenu
  const navigationItem = document.createElement('div');
  navigationItem.className = 'group relative px-3 py-1 text-white text-sm cursor-pointer';
  navigationItem.innerHTML = `
    Navigate Images
    <span class="float-right">▶</span>
  `;

  // Create submenu
  const submenu = document.createElement('div');
  submenu.className = 'absolute left-full top-0 bg-primary-dark shadow-lg rounded py-1 hidden group-hover:block';
  submenu.style.marginLeft = '1px';

  const submenuItems = [
    {
      label: 'First Image',
      onClick: () => handleGoToImage(element, 'first')
    },
    {
      label: 'Last Image',
      onClick: () => handleGoToImage(element, 'last')
    }
  ];

  submenuItems.forEach(item => {
    const submenuItem = document.createElement('div');
    submenuItem.className = 'px-3 py-1 hover:bg-primary-light text-white text-sm cursor-pointer whitespace-nowrap transition-colors duration-200';
    submenuItem.textContent = item.label;
    submenuItem.onclick = () => {
      item.onClick();
      menu.remove();
    };
    submenu.appendChild(submenuItem);
  });

  navigationItem.appendChild(submenu);
  menu.appendChild(navigationItem);

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
