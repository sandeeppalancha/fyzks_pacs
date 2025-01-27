import React, { useState } from 'react';
import Icon from '../Icon';
import ThumbnailList from '../ThumbnailList';


const PriorStudiesPanel = ({ studies, expandedStudyInstanceUIDs, onClickStudy, onClickThumbnail, onDoubleClickThumbnail, activeDisplaySetInstanceUIDs }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-black border-t border-secondary-light">
      <div 
        className="flex items-center p-2 cursor-pointer bg-primary-dark hover:bg-primary-main transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} className="w-4 h-4 text-white" />
        <span className="ml-2 text-white text-base">Prior Studies</span>
      </div>

      {isExpanded && (
        <div className="p-2 h-64 overflow-y-auto">
          {studies.map(study => (
            <div 
              key={study.studyInstanceUID}
              className="mb-2 p-2 bg-primary-dark rounded cursor-pointer hover:bg-primary-main"
              onClick={() => onClickStudy?.(study.studyInstanceUID)}
            >
              <div className="text-white">{study.studyDescription}</div>
              <div className="text-aqua-pale text-sm">
                {study.studyDate} • {study.modalities}
              </div>
              {expandedStudyInstanceUIDs.includes(study.studyInstanceUID) && study.displaySets && (
                <ThumbnailList
                  thumbnails={study.displaySets}
                  activeDisplaySetInstanceUIDs={activeDisplaySetInstanceUIDs}
                  onThumbnailClick={onClickThumbnail}
                  onThumbnailDoubleClick={onDoubleClickThumbnail}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorStudiesPanel;