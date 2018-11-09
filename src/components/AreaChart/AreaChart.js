// @flow
import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';

import Areas from './Areas';
import Axis from '../Axis/Axis';
import Legend from '../Legend/Legend';
import NoData from '../NoData/NoData';

import * as chart from '../../utils/chart';
import * as scales from '../../utils/scales';

import type {
  ChartData,
  Margin,
  AxisConfig,
  ColorScale,
} from '../../utils/commonTypes';

type Props = {|
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** The width the graph or component created inside the SVG should be made. */
  width: number,
  /** The height the graph or component created inside the SVG should be made. */
  height: number,
  /** Object containing the margins for the chart or component. You can specify only certain margins in the object to change just those parts. */
  margin: Margin,
  /** Display or hide the Legend. */
  showLegend: boolean,
  /** Object that defines all the axis values. */
  axisConfig: AxisConfig,
  /** Display or hide the axis grid. */
  showGrid: boolean,
  /** Override the default scale type for the X axis. */
  xScaleType: string,
  /** Override the default scale type for the Y axis. */
  yScaleType: string,
  /** If format is specified, sets the tick format function and returns the axis. See d3-format and d3-time-format for help. */
  tickFormat: string,
  /** Enable / disable gradient color effect. */
  useColorScale: boolean,
  /** Override the default colour scale. For use when useColorScale is enabled. */
  colorScale: ColorScale,
  /** Override the default color scheme. See d3-scale-chromatic for schemes. */
  colorSchemeCategory: Array<string>,
  /** Size of line */
  strokeWidth: number,
  /** Display area animation effect on load. */
  animate: boolean,
  /** Duration of animation. */
  duration: number,
  /** Delay of animation before moving onto next group. */
  delay: number,
  /** Enable / disable responsive chart width. */
  fluid: boolean,
  /** Message to display if no data is provided. */
  noDataMessage: string,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher: Function,
|};

type State = {|
  data: Array<ChartData>,
  width: number,
  color: Function,
|};

/** Class representing a Area chart. */
class AreaChart extends PureComponent<Props, State> {
  static displayName = 'AreaChart';

  static defaultProps = {
    width: 600,
    height: 200,
    margin: { top: 20, left: 40, bottom: 30, right: 10 },
    showLegend: true,
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
    xScaleType: 'ordinal',
    yScaleType: 'linear',
    tickFormat: '.0f',
    useColorScale: true,
    colorScale: { from: '#008793', to: '#00bf72' },
    colorSchemeCategory: [],
    strokeWidth: 1.5,
    animate: true,
    duration: 500,
    delay: 50,
    fluid: true,
    noDataMessage: 'No Data Available.',
    eventDispatcher: dispatch(
      'legendClick',
      'areaClick',
      'areaMouseOver',
      'areaMouseOut',
    ),
  };

  state = {
    data: this.props.data || [],
    width: this.props.fluid ? 0 : this.props.width,
    color: () => undefined,
  };

  componentWillMount() {
    const { data, useColorScale, colorScale, colorSchemeCategory } = this.props;

    const color: any = scales.calculateColorScale(
      data.length,
      useColorScale,
      colorScale,
      colorSchemeCategory,
    );

    this.setState({ color });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  // Element flow types.
  areaChart: ?HTMLElement;
  svg: ?Element;

  /** Updates the width to browser dimensions. */
  updateDimensions = () => {
    const { width, fluid } = this.props;

    if (fluid) {
      this.setState({
        width: (this.areaChart && this.areaChart.offsetWidth) || width,
      });
    }
  };

  /**
   * Update the chart.
   * @param {Array<ChartData>} data - chart data to consume.
   * @param {number} w - width of chart.
   * @param {number} h - height of chart.
   * @param {Margin} m - margin bounds of chart.
   */
  updateChart(data: Array<ChartData>, w: number, h: number, m: Margin) {
    const { eventDispatcher } = this.props;

    /** Setup container of chart. */
    const node = this.svg;
    const svg = select(node);

    svg
      .attr('width', w + m.left + m.right)
      .attr('height', h + m.top + m.bottom)
      .selectAll('.wrapper')
      .attr('transform', `translate(${+m.left}, ${+m.top})`);

    /** Add series index and key to each data area for reference. */
    chart.mapSeriesToData(data);

    /** Event Handling & Dispatching. */
    eventDispatcher.on('legendClick', d => this.setState({ data: d }));
    eventDispatcher.on('areaClick', () => {});
    eventDispatcher.on('areaMouseOver', () => {});
    eventDispatcher.on('areaMouseOut', () => {});
  }

  render() {
    const { data, width, color } = this.state;

    const {
      height,
      margin,
      showLegend,
      axisConfig,
      showGrid,
      xScaleType,
      yScaleType,
      tickFormat,
      strokeWidth,
      animate,
      duration,
      delay,
      noDataMessage,
      eventDispatcher,
    } = this.props;

    const { w, h, m, x, y } = chart.calculateChartValues(
      data.filter(d => !d.disabled),
      width,
      height,
      margin,
      xScaleType,
      yScaleType,
    );

    this.updateChart(data, w, h, m);

    return (
      <div
        ref={c => {
          this.areaChart = c;
        }}
        className="area-chart"
      >
        <svg
          ref={svg => {
            this.svg = svg;
          }}
        >
          {!data.length && (
            <NoData
              width={width}
              height={height}
              noDataMessage={noDataMessage}
            />
          )}
          {data.length && (
            <g className="wrapper">
              <Legend
                data={data}
                width={width}
                margin={m}
                color={color}
                showLegend={showLegend}
                eventDispatcher={eventDispatcher}
              />
              <Axis
                data={data}
                width={width}
                height={h}
                margin={m}
                x={x}
                y={y}
                axisConfig={axisConfig}
                showGrid={showGrid}
                tickFormat={tickFormat}
              />
              <Areas
                data={data}
                height={h}
                x={x}
                y={y}
                color={color}
                strokeWidth={strokeWidth}
                animate={animate}
                duration={duration}
                delay={delay}
                eventDispatcher={eventDispatcher}
              />
            </g>
          )}
        </svg>
      </div>
    );
  }
}

export default AreaChart;
