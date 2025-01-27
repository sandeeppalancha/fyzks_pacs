
import React, { useState } from 'react';
import Icon from '../Icon';
import ThumbnailList from '../ThumbnailList';
import StudyItem from '../StudyItem';
import classNames from 'classnames';

const PriorStudiesPanel = ({
  studies,
  expandedStudyInstanceUIDs,
  onClickStudy,
  onClickThumbnail,
  onDoubleClickThumbnail,
  activeDisplaySetInstanceUIDs,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorStudies = studies.filter(study => !study.active).map(study => ({
    ...study,
    date: study.date || '',
    description: study.description || '',
    numInstances: study.numInstances || 0,
    modalities: study.modalities || '',
    displaySets: study.displaySets || [],
  }));

  if (!priorStudies.length) {
    return null;
  }

  return (
    <div className="w-full bg-black border-t border-secondary-light">
      <div
        className={classNames(
          'flex items-center p-2 cursor-pointer bg-primary-dark hover:bg-primary-main transition-colors',
          { 'border-b border-secondary-light': isExpanded }
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Icon
          name={isExpanded ? 'chevron-down' : 'chevron-right'}
          className="w-4 h-4 text-white"
        />
        <span className="ml-2 text-white text-base">Prior Studies</span>
      </div>
      {isExpanded && (
        <div className="flex flex-row overflow-x-auto">
          {priorStudies.map(study => (
            <div key={study.studyInstanceUid} className="flex-shrink-0 p-2 min-w-[300px]">
              <StudyItem
                date={study.date}
                description={study.description}
                numInstances={study.numInstances}
                modalities={study.modalities}
                isActive={expandedStudyInstanceUIDs.includes(study.studyInstanceUid)}
                onClick={() => onClickStudy(study.studyInstanceUid)}
              >
                {expandedStudyInstanceUIDs.includes(study.studyInstanceUid) && study.displaySets && (
                  <ThumbnailList
                    thumbnails={study.displaySets}
                    activeDisplaySetInstanceUIDs={activeDisplaySetInstanceUIDs}
                    onThumbnailClick={onClickThumbnail}
                    onDoubleClick={onDoubleClickThumbnail}
                  />
                )}
              </StudyItem>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorStudiesPanel;
