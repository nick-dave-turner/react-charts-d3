import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { axisBottom } from 'd3-axis';

import { ChartData, Margin } from '../../utils/commonTypes';

type Props = {
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** The width the graph or component created inside the SVG should be made. */
  width?: number,
  /** The height the graph or component created inside the SVG should be made. */
  height?: number,
  /** Object containing the margins for the chart or component. You can specify only certain margins in the object to change just those parts. */
  margin?: Margin,
  /** Function containing X Scale created by scales.createDomainRangeScales() */
  x: Function,
  /** Show / hide x axis label. */
  showLabel?: boolean,
  /** Label string for x axis. */
  label?: string,
  /** Position of x label. Left / Center / Right. */
  labelPosition?: string,
  /** Display or hide the axis grid. */
  showGrid?: boolean,
};

/** Class representing an XAxis node. */
class XAxis extends PureComponent<Props> {
  static displayName = 'XAxis';

  static defaultProps = {
    width: 600,
    height: 200,
    margin: { top: 20, left: 40, bottom: 30, right: 10 },
    showLabel: true,
    label: 'X Axis',
    labelPosition: 'right',
    showGrid: true,
  };

  /**
   * Determines the position of the x axis label.
   * @param {HTMLElement} node - text element.
   */
  positionAxisLabel = (node: HTMLElement) => {
    const { width, margin, labelPosition } = this.props;
    const formattedWidth = width - margin.left - margin.right;

    switch (labelPosition) {
      case 'left':
        node.attr('x', 0).style('text-anchor', 'start');
        break;

      case 'right':
        node.attr('x', formattedWidth).style('text-anchor', 'end');
        break;

      case 'center':
        node.attr('x', formattedWidth / 2).style('text-anchor', 'middle');
        break;

      default:
        break;
    }
  };

  /** Render the X Axis. */
  renderXAxis = () => {
    const { data, height, x, showLabel, label, showGrid } = this.props;

    if (!x) {
      return;
    }

    const node = this.xAxis;
    const selection = select(node);

    selection.selectAll('*').remove();

    const xAxis: any = selection
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0, ${height})`)
      .datum(data);

    xAxis.call(axisBottom(x));

    xAxis
      .filter(() => showLabel)
      .append('text')
      .attr('class', 'label')
      .attr('y', 30)
      .text(label);

    xAxis.filter(() => showLabel).call(() => {
      const labelNode = xAxis.selectAll('.label');
      this.positionAxisLabel(labelNode);
    });

    xAxis
      .filter(() => showGrid)
      .append('g')
      .attr('class', 'grid x-grid')
      .call(
        axisBottom(x)
          .tickSize(-height, 0, 0)
          .tickFormat(''),
      );
  };

  render() {
    this.renderXAxis();
    return (
      <g
        ref={xAxis => {
          this.xAxis = xAxis;
        }}
        className="xAxis"
      />
    );
  }
}

export default XAxis;
