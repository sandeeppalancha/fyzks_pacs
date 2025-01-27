
import React, { useState } from 'react';
import Icon from '../Icon';
import ThumbnailList from '../ThumbnailList';
import StudyItem from '../StudyItem';

const PriorStudiesPanel = ({
  studies,
  expandedStudyInstanceUIDs,
  onClickStudy,
  onClickThumbnail,
  onDoubleClickThumbnail,
  activeDisplaySetInstanceUIDs,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorStudies = studies.filter(study => !study.active);

  if (!priorStudies.length) {
    return null;
  }

  return (
    <div className="w-full bg-primary-dark">
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-primary-light"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-primary-active text-lg font-bold">Prior Studies</span>
        <Icon
          name={isExpanded ? 'chevron-down' : 'chevron-right'}
          className="w-4 h-4"
        />
      </div>
      {isExpanded && (
        <div className="flex flex-row overflow-x-auto p-2">
          {priorStudies.map(study => (
            <div key={study.studyInstanceUid} className="mr-4 min-w-[300px]">
              <StudyItem
                study={study}
                isExpanded={expandedStudyInstanceUIDs.includes(study.studyInstanceUid)}
                onClickStudy={onClickStudy}
              >
                {study.displaySets.length && expandedStudyInstanceUIDs.includes(study.studyInstanceUid) ? (
                  <ThumbnailList
                    thumbnails={study.displaySets}
                    activeDisplaySetInstanceUIDs={activeDisplaySetInstanceUIDs}
                    onThumbnailClick={onClickThumbnail}
                    onDoubleClick={onDoubleClickThumbnail}
                  />
                ) : null}
              </StudyItem>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorStudiesPanel;
