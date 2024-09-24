import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import Icon from '../Icon';
import Tooltip from '../Tooltip';

const baseClasses =
  'first:border-0 border-t border-secondary-light cursor-pointer select-none outline-none';

const StudyItem = ({
  date,
  description,
  numInstances,
  modalities,
  trackedSeries,
  isActive,
  onClick,
  position,
}) => {
  const { t } = useTranslation('StudyItem');
  return (
    <div
      className={classnames(
        position === 'bottom' ? 'bottom-study-item' : '',
        isActive ? 'bg-secondary-dark' : 'hover:bg-secondary-main bg-black',
        baseClasses
      )}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex="0"
    >
      <div className="flex flex-1 flex-col px-4 p!b-2">
        <div className={classnames("flex", "flex-row", "items-center", "justify-between", position === 'bottom' ? 'pt-1 pb-1' : 'pt-2 pb-2')}>
          <div className={classnames(position === 'bottom' ? 'line-height1' : '', "text-base", "text-white")}>{date}</div>
          {
            position === 'bottom' && (
              <a onClick={(e) => { e.stopPropagation() }} className='text-white' href="/" target="_blank">[DR]</a>
            )
          }
          {
            position === 'bottom' ? null : (
              <div className="flex flex-row items-center text-base text-blue-300">
                <Icon
                  name="group-layers"
                  className="mx-2 w-4 text-blue-300"
                />
                {numInstances}
              </div>
            )
          }
          {
            position === 'bottom' && (
              isActive ? (
                <Tooltip
                  content={"Collapse"}
                  position="bottom-left"
                >
                  <Icon
                    title="Collapse"
                    name="chevron-left"
                    className="text-primary-light mr-2 w-6"
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  content={"Expand"}
                  position="bottom-left"
                >
                  <Icon
                    title="Expand"
                    name="chevron-right"
                    className="text-primary-light mr-2 w-6"
                  />
                </Tooltip>
              )

            )
          }
        </div>
        <div className="flex flex-row py-1">
          <div className={classnames(position === 'bottom' ? 'line-height1' : '', "text-l", "pr-5", "text-blue-300")}>{modalities}</div>
          <div className={classnames(position === 'bottom' ? 'study-item-desc' : '', "truncate-2-lines", "break-words", "text-base", "text-blue-300")}>{description}</div>
        </div>
      </div>
      {!!trackedSeries && (
        <div className="flex-2 flex">
          <div
            className={classnames(
              'bg-secondary-main mt-2 flex flex-row py-1 pl-2 pr-4 text-base text-white ',
              isActive
                ? 'border-secondary-light flex-1 justify-center border-t'
                : 'mx-4 mb-4 rounded-sm'
            )}
          >
            <Icon
              name="tracked"
              className="text-primary-light mr-2 w-4"
            />
            {t('Tracked series', { trackedSeries: trackedSeries })}
          </div>
        </div>
      )}
    </div>
  );
};

StudyItem.propTypes = {
  date: PropTypes.string.isRequired,
  description: PropTypes.string,
  modalities: PropTypes.string.isRequired,
  numInstances: PropTypes.number.isRequired,
  trackedSeries: PropTypes.number,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default StudyItem;
