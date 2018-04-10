// @flow
import React, { PureComponent } from 'react';

import { select } from 'd3-selection';

import './noData.css';

type Props = {|
  /** The width the graph or component created inside the SVG should be made. */
  width: number,
  /** The height the graph or component created inside the SVG should be made. */
  height: number,
  /** Message to display if no data is provided. */
  noDataMessage: string,
|};

/** Class representing No Data node. */
class NoData extends PureComponent<Props> {
  static displayName = 'NoData';

  static defaultProps = {
    width: 600,
    height: 200,
    noDataMessage: 'No Data Available.',
  };

  // Element flow types.
  noData: ?Element;

  /** Renders the No Data message node. */
  renderNoData = () => {
    const { width, height, noDataMessage } = this.props;

    const node = this.noData;
    const selection = select(node);

    selection.selectAll('*').remove();

    const message = selection.selectAll('.no-data').data([noDataMessage]);

    const messageEnter = message
      .enter()
      .append('g')
      .attr('class', 'no-data');

    messageEnter.exit().remove();

    messageEnter
      .append('text')
      .text(d => d)
      .attr('x', width / 2)
      .attr('y', height / 2);
  };

  render() {
    this.renderNoData();
    return (
      <g
        ref={noData => {
          this.noData = noData;
        }}
        className="noData"
      />
    );
  }
}

export default NoData;
