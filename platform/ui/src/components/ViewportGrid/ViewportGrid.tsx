import React from 'react';
import PropTypes from 'prop-types';

function ViewportGrid({ numRows, numCols, layoutType, children, onViewportClick }) {
  const handleViewportClick = (viewportIndex) => {
    if (onViewportClick) {
      onViewportClick(viewportIndex);
    }
  };

  const renderedChildren = React.Children.map(children, (child, index) => (
    <div
      key={index}
      onClick={() => handleViewportClick(index)}
      style={{
        position: 'absolute',
        //Basic layout - needs improvement for actual grid layout
        width: `${100 / numCols}%`,
        height: `${100 / numRows}%`,
        top: `${Math.floor(index / numCols) * (100 / numRows)}%`,
        left: `${(index % numCols) * (100 / numCols)}%`,
      }}
    >
      {child}
    </div>
  ));


  return (
    <div
      data-cy="viewport-grid"
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      {renderedChildren}
    </div>
  );
}

ViewportGrid.propTypes = {
  /** Number of columns */
  numRows: PropTypes.number.isRequired,
  /** Number of rows */
  numCols: PropTypes.number.isRequired,
  layoutType: PropTypes.string,
  /** Array of React Components to render within grid */
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  onViewportClick: PropTypes.func,
};

export default ViewportGrid;