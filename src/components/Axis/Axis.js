// @flow
import React, { PureComponent } from 'react';

import XAxis from './XAxis';
import YAxis from './YAxis';
import './axis.css';

import { ChartData, Margin, AxisConfig } from '../../utils/commonTypes';

type Props = {|
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** The width the graph or component created inside the SVG should be made. */
  width: number,
  /** The height the graph or component created inside the SVG should be made. */
  height: number,
  /** Object containing the margins for the chart or component. You can specify only certain margins in the object to change just those parts. */
  margin: Margin,
  /** Function containing X Scale created by scales.createDomainRangeScales() */
  x: Function,
  /** Function containing Y Scale created by scales.createDomainRangeScales() */
  y: Function,
  /** Object that defines all the axis values. */
  axisConfig: AxisConfig,
  /** Display or hide the axis grid. */
  showGrid: boolean,
  /** If format is specified, sets the tick format function and returns the axis. See d3-format and d3-time-format for help. */
  tickFormat: string,
|};

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
    tickFormat: '.0f',
  };

  // Element flow types.
  axis: ?Element;

  render() {
    const {
      data,
      width,
      height,
      margin,
      x,
      y,
      axisConfig,
      showGrid,
      tickFormat,
    } = this.props;

    return (
      <g
        ref={axis => {
          this.axis = axis;
        }}
        className="axis"
      >
        {axisConfig.showXAxis && (
          <XAxis
            data={data}
            width={width}
            margin={margin}
            height={height}
            x={x}
            showLabel={axisConfig.showXAxis}
            label={axisConfig.xLabel}
            labelPosition={axisConfig.xLabelPosition}
            showGrid={showGrid}
          />
        )}
        {axisConfig.showYAxis && (
          <YAxis
            data={data}
            width={width}
            margin={margin}
            height={height}
            y={y}
            showLabel={axisConfig.showYAxis}
            label={axisConfig.yLabel}
            labelPosition={axisConfig.yLabelPosition}
            showGrid={showGrid}
            tickFormat={tickFormat}
          />
        )}
      </g>
    );
  }
}

export default Axis;
