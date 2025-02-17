import React, { useState } from 'react';
import { Enums } from '@cornerstonejs/tools';

export const SyncTool = ({ servicesManager }) => {
  const [syncMode, setSyncMode] = useState('none');
  const { syncGroupService, viewportGridService } = servicesManager.services;

  const handleSyncModeChange = (mode) => {
    setSyncMode(mode);

    if (mode === 'none') {
      // Disable all synchronizers
      const synchronizers = syncGroupService.getAllSynchronizers();
      synchronizers.forEach(sync => {
        sync.disabled = true;
      });
    }
    else if (mode === 'auto') {
      // Enable auto sync using existing OHIF sync
      const viewports = viewportGridService.getViewports();
      const synchronizer = syncGroupService.createSynchronizer(
        'imageSlice',
        [viewports[0].viewportId, viewports[1].viewportId]
      );
      synchronizer.enabled = true;
    }
  };

  return (
    <select
      value={syncMode}
      onChange={(e) => handleSyncModeChange(e.target.value)}
      className="px-2 py-1 bg-black border border-primary-light rounded"
    >
      <option value="none">No Sync</option>
      <option value="auto">Auto Sync</option>
    </select>
  );
};
