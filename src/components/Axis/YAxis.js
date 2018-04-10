// @flow
import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { axisLeft } from 'd3-axis';

import { ChartData, Margin } from '../../utils/commonTypes';

type Props = {|
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** The width the graph or component created inside the SVG should be made. */
  width: number,
  /** The height the graph or component created inside the SVG should be made. */
  height: number,
  /** Object containing the margins for the chart or component. You can specify only certain margins in the object to change just those parts. */
  margin: Margin,
  /** Function containing Y Scale created by scales.createDomainRangeScales() */
  y: Function,
  /** Show / hide y axis label. */
  showLabel: boolean,
  /** Label string for y axis. */
  label: string,
  /** Position of y label. Top / Middle / Bottom. */
  labelPosition: string,
  /** Display or hide the axis grid. */
  showGrid: boolean,
  /** If format is specified, sets the tick format function and returns the axis. See d3-format and d3-time-format for help. */
  tickFormat: string,
|};

/** Class representing an YAxis node. */
class YAxis extends PureComponent<Props> {
  static displayName = 'YAxis';

  static defaultProps = {
    width: 600,
    height: 200,
    margin: { top: 20, left: 40, bottom: 30, right: 10 },
    showLabel: true,
    label: 'Y Axis',
    labelPosition: 'top',
    showGrid: true,
    tickFormat: '',
  };

  // Element flow types.
  yAxis: ?Element;

  /**
   * Determines the position of the y axis label.
   * @param {Element} node - text element.
   */
  positionAxisLabel = (node: ?Element) => {
    const { height, labelPosition } = this.props;

    switch (labelPosition) {
      case 'top':
        // $FlowFixMe
        node.attr('x', 0).style('text-anchor', 'end');
        break;

      case 'bottom':
        // $FlowFixMe
        node.attr('x', 0 - height).style('text-anchor', 'start');
        break;

      case 'middle':
        // $FlowFixMe
        node.attr('x', 0 - height / 2).style('text-anchor', 'middle');
        break;

      default:
        break;
    }
  };

  /** Render the Y Axis. */
  renderYAxis = () => {
    const {
      data,
      width,
      margin,
      y,
      showLabel,
      label,
      showGrid,
      tickFormat,
    } = this.props;

    if (!y) {
      return;
    }

    const node = this.yAxis;
    const selection = select(node);

    selection.selectAll('*').remove();

    const yAxis: any = selection
      .append('g')
      .attr('class', 'axis y-axis')
      .datum(data);

    yAxis.call(axisLeft(y).ticks(10, tickFormat));

    yAxis
      .filter(() => showLabel)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - 30)
      .text(label);

    yAxis.filter(() => showLabel).call(() => {
      const labelNode = yAxis.selectAll('.label');
      this.positionAxisLabel(labelNode);
    });

    yAxis
      .filter(() => showGrid)
      .append('g')
      .attr('class', 'grid y-grid')
      .call(
        axisLeft(y)
          .tickSize(-(width - margin.left - margin.right) - 1, 0, 0)
          .tickFormat(''),
      );
  };

  render() {
    this.renderYAxis();
    return (
      <g
        ref={yAxis => {
          this.yAxis = yAxis;
        }}
        className="yAxis"
      />
    );
  }
}

export default YAxis;
