import React from 'react';
import { DicomMetadataStore } from '@ohif/core';
import ThumbnailList from '../ThumbnailList';
import StudyItem from '../StudyItem';

interface PriorStudiesPanelProps {
  onStudySelect?: (StudyInstanceUID: string) => void;
}

export default function PriorStudiesPanel({ onStudySelect }: PriorStudiesPanelProps) {
  const studies = DicomMetadataStore.getInstance().get('studies') || [];
  const sortedStudies = [...studies].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const priorStudies = sortedStudies.filter(study => !study.active);

  return (
    <div className="flex flex-col">
      <div className="p-4 text-lg font-semibold">Prior Studies</div>
      <div className="flex flex-col gap-2">
        {priorStudies.map(study => (
          <StudyItem
            key={study.studyInstanceUid}
            date={study.date}
            description={study.description}
            modalities={study.modalities}
            numInstances={study.numInstances}
            onClick={() => onStudySelect?.(study.studyInstanceUid)}
          />
        ))}
        {priorStudies.length === 0 && (
          <div className="p-4 text-gray-500">No prior studies available</div>
        )}
      </div>
    </div>
  );
}