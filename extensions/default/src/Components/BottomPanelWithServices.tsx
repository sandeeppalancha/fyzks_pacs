import React, { useEffect, useState, useCallback } from 'react';
import { CommandsManager, ExtensionManager, PanelService, ServicesManager, Types } from '@ohif/core';
import { BottomPanel } from '@ohif/ui';

export type BottomPanelWithServicesProps = {
  servicesManager: ServicesManager;
  commandsManager: CommandsManager;
  extensionManager: ExtensionManager;
  side: 'left' | 'right';
  className: string;
  activeTabIndex: number;
  tabs: any;
  expandedWidth?: number;
};

const BottomPanelWithServices = (props: BottomPanelWithServicesProps) => {
  const { servicesManager,
    side,
    activeTabIndex: activeTabIndexProp,
    tabs: tabsProp,
    expandedWidth, } = props;
  const panelService: PanelService = servicesManager?.services?.panelService;

  // Tracks whether this SidePanel has been opened at least once since this SidePanel was inserted into the DOM.
  // Thus going to the Study List page and back to the viewer resets this flag for a SidePanel.
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(activeTabIndexProp);
  const [tabs, setTabs] = useState(tabsProp ?? panelService.getPanels(side));

  // console.log("bottompanel with services", tabs);


  const handleSidePanelOpen = useCallback(() => {
    setHasBeenOpened(true);
  }, []);

  const handleActiveTabIndexChange = useCallback(({ activeTabIndex }) => {
    setActiveTabIndex(activeTabIndex);
  }, []);

  /** update the active tab index from outside */
  useEffect(() => {
    setActiveTabIndex(activeTabIndexProp);
  }, [activeTabIndexProp]);

  useEffect(() => {
    const { unsubscribe } = panelService.subscribe(
      panelService.EVENTS.PANELS_CHANGED,
      panelChangedEvent => {
        if (panelChangedEvent.position !== side) {
          return;
        }

        setTabs(panelService.getPanels(side));
      }
    );

    return () => {
      unsubscribe();
    };
  }, [panelService, side]);

  useEffect(() => {
    const activatePanelSubscription = panelService.subscribe(
      panelService.EVENTS.ACTIVATE_PANEL,
      (activatePanelEvent: Types.ActivatePanelEvent) => {
        if (!hasBeenOpened || activatePanelEvent.forceActive) {
          const tabIndex = tabs.findIndex(tab => tab.id === activatePanelEvent.panelId);
          if (tabIndex !== -1) {
            setActiveTabIndex(tabIndex);
          }
        }
      }
    );

    return () => {
      activatePanelSubscription.unsubscribe();
    };
  }, [tabs, hasBeenOpened, panelService]);

  return (
    <BottomPanel
      {...props}
      side={side}
      tabs={tabs}
      activeTabIndex={activeTabIndex}
      onOpen={handleSidePanelOpen}
      onActiveTabIndexChange={handleActiveTabIndexChange}
      expandedWidth={expandedWidth}
    ></BottomPanel>
  );
};

export default BottomPanelWithServices;
