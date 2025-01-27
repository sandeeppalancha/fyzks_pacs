
import React, { useState } from 'react';
import Icon from '../Icon';
import ThumbnailList from '../ThumbnailList';
import StudyItem from '../StudyItem';
import classNames from 'classnames';
import { DicomMetadataStore } from '@ohif/core';

const PriorStudiesPanel = ({
  onClickStudy,
  onClickThumbnail,
  onDoubleClickThumbnail,
  activeDisplaySetInstanceUIDs,
  currentStudyInstanceUID,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get all studies from DicomMetadataStore
  const allStudies = DicomMetadataStore.getStudies();
  
  // Filter out the current study to get prior studies
  const priorStudies = allStudies
    .filter(study => study.StudyInstanceUID !== currentStudyInstanceUID)
    .sort((a, b) => {
      const dateA = new Date(a.StudyDate);
      const dateB = new Date(b.StudyDate);
      return dateB - dateA;  // Sort by date, most recent first
    })
    .map(study => ({
      studyInstanceUid: study.StudyInstanceUID,
      date: study.StudyDate,
      description: study.StudyDescription || '',
      numInstances: study.NumInstances || 0,
      modalities: study.ModalitiesInStudy?.join(', ') || '',
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
        <div className="flex flex-row overflow-x-auto p-2 gap-4" style={{ maxHeight: '200px' }}>
          {priorStudies.map(study => (
            <div key={study.studyInstanceUid} className="flex-shrink-0 min-w-[300px]">
              <StudyItem
                date={study.date}
                description={study.description}
                numInstances={study.numInstances}
                modalities={study.modalities}
                isActive={false}
                onClick={() => onClickStudy(study.studyInstanceUid)}
              >
                {study.displaySets && (
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
