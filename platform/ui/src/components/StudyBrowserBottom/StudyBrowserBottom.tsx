import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import StudyItem from '../StudyItem';
import LegacyButtonGroup from '../LegacyButtonGroup';
import LegacyButton from '../LegacyButton';
import ThumbnailList from '../ThumbnailList';
import { StringNumber } from '../../types';
import { debounce } from '../../../../core/src/utils';

const getTrackedSeries = displaySets => {
  let trackedSeries = 0;
  displaySets.forEach(displaySet => {
    if (displaySet.isTracked) {
      trackedSeries++;
    }
  });

  return trackedSeries;
};

const StudyBrowserBottom = ({
  tabs,
  activeTabName,
  expandedStudyInstanceUIDs,
  onClickTab,
  onClickStudy,
  onClickThumbnail,
  onDoubleClickThumbnail,
  onClickUntrack,
  activeDisplaySetInstanceUIDs,
  servicesManager,
  createDisplaySetForStudy,
  setExpandedStudyInstanceUIDs
}) => {
  const { t } = useTranslation('StudyBrowser');
  const { customizationService, viewportGridService } = servicesManager?.services || {};

  useEffect(() => {
    // console.log("useEffect outside", tabs);

    const recentsTab = tabs.find(tab => tab.name === 'recent');
    if (recentsTab.studies && recentsTab.studies.length > 0) {
      // console.log("bottompanel useEffect", recentsTab.studies);

      const allRecentStudies = [];
      recentsTab.studies.forEach(std => {
        if (!std.displaySets || std.displaySets.length == 0) {
          // console.log("bottompanel no displaysets");

          // createDisplaySetForStudy(std.studyInstanceUid);
          setExpandedStudyInstanceUIDs([...expandedStudyInstanceUIDs, std.studyInstanceUid]);
        } else {
          allRecentStudies.push(std)
        }
      });

      const { recent_studies } = viewportGridService.getState();
      console.log("Set recent studies **&", allRecentStudies, recent_studies);
      // if (recentsTab.studies.length !== recent_studies?.studies?.length) {
      //   setRecentStudyDisplaysets
      // }
      // setRecentStudyDisplaysets(allRecentStudies)

    }
  }, [])

  const getTabContent = () => {
    const tabData = tabs.find(tab => tab.name === activeTabName);
    // console.log("bottompanel study tabData", tabData);

    if (tabData.studies.length > 0) {
      // tabData.studies.push({ ...tabData.studies[0], date: '01-Sep-2024' });
      // tabData.studies.push({ ...tabData.studies[0], date: '21-Jan-2024' });
      // tabData.studies.push({ ...tabData.studies[0], date: '01-Jan-2024' });
      // tabData.studies.push(tabData.studies[0]);
      // tabData.studies.push(tabData.studies[0]);
    }

    return tabData.studies.map(
      ({ studyInstanceUid, date, description, numInstances, modalities, displaySets }) => {
        const isExpanded = expandedStudyInstanceUIDs.includes(studyInstanceUid);
        // console.log("bottompanel displaySets", displaySets);

        return (
          <React.Fragment key={studyInstanceUid}>
            <div className="prev-study-item" style={{}}>
              <StudyItem
                date={date}
                description={description}
                numInstances={numInstances}
                modalities={modalities}
                trackedSeries={getTrackedSeries(displaySets)}
                isActive={isExpanded}
                onClick={() => {
                  onClickStudy(studyInstanceUid);
                }}
                data-cy="thumbnail-list"
                position="bottom"
              />
              {isExpanded && displaySets && (
                <ThumbnailList
                  thumbnails={displaySets}
                  activeDisplaySetInstanceUIDs={activeDisplaySetInstanceUIDs}
                  onThumbnailClick={onClickThumbnail}
                  onThumbnailDoubleClick={onDoubleClickThumbnail}
                  onClickUntrack={onClickUntrack}
                  customStyle={{ display: 'flex', minHeight: '150px !important' }}
                  position='bottom'
                />
              )}
            </div>
          </React.Fragment>
        );
      }
    );
  };

  // console.log("bottompanel study browser tabs", tabs);


  {/* TODO Revisit design of LegacyButtonGroup later - for now use LegacyButton for its children.*/ }
  {/* <LegacyButtonGroup
          variant="outlined"
          color="secondary"
          splitBorder={false}
        >
          {tabs.map(tab => {
            const { name, label, studies } = tab;
            const isActive = activeTabName === name;
            const isDisabled = !studies.length;
            // Apply the contrasting color for brighter button color visibility
            const classStudyBrowser = customizationService?.getModeCustomization(
              'class:StudyBrowser'
            ) || {
              true: 'default',
              false: 'default',
            };
            const color = classStudyBrowser[`${isActive}`];
            return (
              <LegacyButton
                key={name}
                className={'min-w-18 p-2 text-base text-white'}
                size="initial"
                color={color}
                bgColor={isActive ? 'bg-primary-main' : 'bg-black'}
                onClick={() => {
                  onClickTab(name);
                }}
                disabled={isDisabled}
              >
                {t(label)}
              </LegacyButton>
            );
          })}
        </LegacyButtonGroup> */}

  return (
    <React.Fragment>
      {/* <div
        className="w-100 border-secondary-light bg-primary-dark flex h-16 flex-row items-center justify-center border-b p-4"
        data-cy={'studyBrowser-panel'}
      >
      </div> */}
      <div style={{ display: '-webkit-box', width: '100%' }} className="bottom-prev-studies ohif-scrollbar invisible-scrollbar !fle!x flex!-1 flex-!!col overflow-auto">
        {getTabContent()}
      </div>
    </React.Fragment>
  );
};

StudyBrowserBottom.propTypes = {
  onClickTab: PropTypes.func.isRequired,
  onClickStudy: PropTypes.func,
  onClickThumbnail: PropTypes.func,
  onDoubleClickThumbnail: PropTypes.func,
  onClickUntrack: PropTypes.func,
  activeTabName: PropTypes.string.isRequired,
  expandedStudyInstanceUIDs: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeDisplaySetInstanceUIDs: PropTypes.arrayOf(PropTypes.string),
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      studies: PropTypes.arrayOf(
        PropTypes.shape({
          studyInstanceUid: PropTypes.string.isRequired,
          date: PropTypes.string,
          numInstances: PropTypes.number,
          modalities: PropTypes.string,
          description: PropTypes.string,
          displaySets: PropTypes.arrayOf(
            PropTypes.shape({
              displaySetInstanceUID: PropTypes.string.isRequired,
              imageSrc: PropTypes.string,
              imageAltText: PropTypes.string,
              seriesDate: PropTypes.string,
              seriesNumber: StringNumber,
              numInstances: PropTypes.number,
              description: PropTypes.string,
              componentType: PropTypes.oneOf(['thumbnail', 'thumbnailTracked', 'thumbnailNoImage'])
                .isRequired,
              isTracked: PropTypes.bool,
              /**
               * Data the thumbnail should expose to a receiving drop target. Use a matching
               * `dragData.type` to identify which targets can receive this draggable item.
               * If this is not set, drag-n-drop will be disabled for this thumbnail.
               *
               * Ref: https://react-dnd.github.io/react-dnd/docs/api/use-drag#specification-object-members
               */
              dragData: PropTypes.shape({
                /** Must match the "type" a dropTarget expects */
                type: PropTypes.string.isRequired,
              }),
            })
          ),
        })
      ).isRequired,
    })
  ),
};

const noop = () => { };

StudyBrowserBottom.defaultProps = {
  onClickTab: noop,
  onClickStudy: noop,
  onClickThumbnail: noop,
  onDoubleClickThumbnail: noop,
  onClickUntrack: noop,
};

export default StudyBrowserBottom;
