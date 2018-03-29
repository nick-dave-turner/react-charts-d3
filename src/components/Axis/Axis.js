import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';

import './axis.css';

import { ChartData, Margin, AxisConfig } from '../../utils/commonTypes';

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
  /** Function containing Y Scale created by scales.createDomainRangeScales() */
  y: Function,
  /** Object that defines all the axis values. */
  axisConfig?: AxisConfig,
  /** Display or hide the axis grid. */
  showGrid?: boolean,
  /** If format is specified, sets the tick format function and returns the axis. See d3-format and d3-time-format for help. */
  tickFormat?: string,
};

/** Class representing an Axis node. */
class Axis extends PureComponent<Props> {
  static displayName = 'Axis';

  static defaultProps = {
    width: 600,
    height: 200,
    margin: { top: 20, left: 40, bottom: 30, right: 10 },
    axisConfig: {
      showXAxis: true,
      showXAxisLabel: true,
      xLabel: 'X Axis',
      xLabelPosition: 'right',
      showYAxis: true,
      showYAxisLabel: true,
      yLabel: 'Y Axis',
      yLabelPosition: 'top',
    },
    showGrid: true,
    tickFormat: '',
  };

  /**
   * Determines the position of the axis label.
   * @param {HTMLElement} node - text element.
   * @param {string} position - position of label.
   * @param {number} width - width of chart minus margins.
   * @param {number} height - height of chart minus margins.
   */
  positionAxisLabel = (
    node: HTMLElement,
    position: string,
    width: number,
    height: number,
  ) => {
    switch (position) {
      case 'left':
        node.attr('x', 0).style('text-anchor', 'start');
        break;

      case 'right':
        node.attr('x', width).style('text-anchor', 'end');
        break;

      case 'center':
        node.attr('x', width / 2).style('text-anchor', 'middle');
        break;

      case 'top':
        node.attr('x', 0).style('text-anchor', 'end');
        break;

      case 'bottom':
        node.attr('x', 0 - height).style('text-anchor', 'start');
        break;

      case 'middle':
        node.attr('x', 0 - height / 2).style('text-anchor', 'middle');
        break;

      default:
        break;
    }
  };

  /**
   * Render the X Axis.
   * @param {HTMLElement} root - the Axes node.
   */
  renderXAxis = (root: HTMLElement) => {
    const { data, width, height, margin, x, axisConfig, showGrid } = this.props;
    const { showXAxisLabel, xLabel, xLabelPosition } = axisConfig;

    const xAxis: any = root
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0, ${height})`)
      .datum(data);

    xAxis.call(axisBottom(x));

    xAxis
      .filter(() => showXAxisLabel)
      .append('text')
      .attr('class', 'label')
      .attr('y', 30)
      .text(xLabel);

    xAxis.filter(() => showXAxisLabel).call(() => {
      const label = xAxis.selectAll('.label');
      const formattedWidth = width - margin.left - margin.right;
      this.positionAxisLabel(label, xLabelPosition, formattedWidth, height);
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

  /**
   * Render the Y Axis.
   * @param {HTMLElement} root - the Axes node.
   */
  renderYAxis = (root: HTMLElement) => {
    const {
      data,
      width,
      height,
      margin,
      y,
      axisConfig,
      showGrid,
      tickFormat,
    } = this.props;

    const { showYAxisLabel, yLabel, yLabelPosition } = axisConfig;

    const yAxis: any = root
      .append('g')
      .attr('class', 'axis y-axis')
      .datum(data);

    yAxis.call(axisLeft(y).ticks(10, tickFormat));

    yAxis
      .filter(() => showYAxisLabel)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - 30)
      .text(yLabel);

    yAxis.filter(() => showYAxisLabel).call(() => {
      const label = yAxis.selectAll('.label');
      const formattedWidth = width - margin.left - margin.right;
      this.positionAxisLabel(label, yLabelPosition, formattedWidth, height);
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

  /** Render the Axes. */
  renderAxes = () => {
    const { axisConfig } = this.props;
    const { showXAxis, showYAxis } = axisConfig;

    const node = this.axis;
    const selection = select(node);

    selection.selectAll('*').remove();

    if (showXAxis) {
      this.renderXAxis(selection);
    }

    if (showYAxis) {
      this.renderYAxis(selection);
    }
  };

  render() {
    this.renderAxes();
    return (
      <g
        ref={axis => {
          this.axis = axis;
        }}
        className="axes"
      />
    );
  }
}

export default Axis;
