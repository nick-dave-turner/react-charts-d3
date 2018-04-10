// @flow
import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';

import './legend.css';

import { ChartData, Margin } from '../../utils/commonTypes';

type Props = {|
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** The width the graph or component created inside the SVG should be made. */
  width: number,
  /** Display or hide the Legend. */
  showLegend: boolean,
  /** Function containing the chart or component color-scale. */
  color: Function,
  /** Object containing the margins for the chart or component. You can specify only certain margins in the object to change just those parts. */
  margin: Margin,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher: Function,
|};

/** Class representing a Legend node. */
class Legend extends PureComponent<Props> {
  static displayName = 'Legend';

  static defaultProps = {
    showLegend: true,
    margin: { top: 20, left: 40, bottom: 30, right: 10 },
    eventDispatcher: dispatch('legendClick'),
  };

  // Element flow types.
  legend: ?Element;

  /**
   * Updates the legend item widths.
   * @param {Element} svg - the legend node.
   */
  updateLegend = (svg: ?Element) => {
    const legendItems = select(svg).selectAll('.legend-item');
    let prevLength = 0;

    legendItems.each(function legendLoop() {
      const item = select(this);

      const length = item
        .select('text')
        .node()
        .getComputedTextLength();

      item.attr('transform', `translate(${prevLength}, 0)`);
      prevLength = length + prevLength + 25;
    });
  };

  /** Renders the legend node. */
  renderLegend = () => {
    const { data, margin, color, eventDispatcher } = this.props;

    const node = this.legend;
    const selection = select(node);

    selection.selectAll('*').remove();

    const legend = selection
      .append('g')
      .attr('transform', `translate(0, ${-margin.top})`)
      .selectAll('.legend-item')
      .data(data);

    const legendEnter = legend
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(${i === 0 ? 0 : i * 100}, 0)`);

    legendEnter.exit().remove();

    const legendIcon = legendEnter.append('rect').attr('class', 'legend-icon');

    legendIcon
      .filter(d => d.disabled)
      .attr('width', 8)
      .attr('height', 8)
      .attr('x', 1)
      .attr('y', 1)
      .style('stroke', d => color(d.index))
      .style('stroke-width', 2)
      .style('fill', 'none');

    legendIcon
      .filter(d => !d.disabled)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', d => color(d.index));

    legendEnter
      .append('text')
      .attr('class', 'legend-label')
      .text(d => d.key)
      .attr('dx', 15)
      .attr('dy', 8);

    this.updateLegend(node);

    /** Legend interactions. (d3.dispatch) */
    legendEnter.on('click', (d, i) => {
      let mappedData = [];

      /** Need to set disabled to true / false here to filter data. */
      const disabledData = data.map((series, index) => {
        const newSeries = { ...series };
        if (i === index) {
          newSeries.disabled = !newSeries.disabled;
        }
        return newSeries;
      });

      /** If every single series is disabled, turn all series' back on. */
      if (disabledData.every(series => series.disabled)) {
        mappedData = disabledData.map(series => {
          const newSeries = { ...series };
          newSeries.disabled = false;
          return newSeries;
        });
      } else {
        mappedData = disabledData;
      }

      // $FlowFixMe
      eventDispatcher.apply('legendClick', this, [mappedData]);
    });
  };

  render() {
    const { width, showLegend } = this.props;

    if (showLegend && width) {
      this.renderLegend();
    }

    return (
      <g
        ref={legend => {
          this.legend = legend;
        }}
        className="legend-wrapper"
      />
    );
  }
}

export default Legend;
