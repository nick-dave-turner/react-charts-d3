import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';

import Axis from '../Axis/Axis';
import Legend from '../Legend/Legend';

import lines from '../../models/lines';
import noData from '../../models/noData';

import * as chart from '../../utils/chart';
import * as scales from '../../utils/scales';

import type { ChartData, Margin, AxisConfig } from '../../utils/commonTypes';

type Props = {
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** The width the graph or component created inside the SVG should be made. */
  width?: number,
  /** The height the graph or component created inside the SVG should be made. */
  height?: number,
  /** Object containing the margins for the chart or component. You can specify only certain margins in the object to change just those parts. */
  margin?: Margin,
  /** Display or hide the Legend. */
  showLegend?: boolean,
  /** Object that defines all the axis values. */
  axisConfig?: AxisConfig,
  /** Display or hide the axis grid. */
  showGrid?: boolean,
  /** Override the default scale type for the X axis. */
  xScaleType?: string,
  /** Override the default scale type for the Y axis. */
  yScaleType?: string,
  /** If format is specified, sets the tick format function and returns the axis. See d3-format and d3-time-format for help. */
  tickFormat?: string,
  /** Enable / disable gradient color effect. */
  useColorScale?: boolean,
  /** Override the default colour scale. For use when useColorScale is enabled. */
  colorScale?: scales.ColorScale,
  /** Override the default color scheme. See d3-scale-chromatic for schemes. */
  colorSchemeCategory?: any,
  /** Enable / disable responsive chart width. */
  fluid?: boolean,
  /** Message to display if no data is provided. */
  noDataMessage?: string,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher: Function,
};

type State = {
  data: Array<ChartData>,
  width: number,
};

/** Class representing a Line chart. */
class LineChart extends PureComponent<Props, State> {
  static displayName = 'LineChart';

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
    tickFormat: '',
    useColorScale: true,
    colorScale: { from: '#008793', to: '#00bf72' },
    colorSchemeCategory: false,
    fluid: true,
    noDataMessage: 'No Data Available.',
    eventDispatcher: dispatch(
      'legendClick',
      'lineClick',
      'lineMouseOver',
      'lineMouseOut',
    ),
  };

  state = {
    data: this.props.data || [],
    width: this.props.fluid ? 0 : this.props.width,
    color: null,
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

  /** Updates the width to browser dimensions. */
  updateDimensions = () => {
    const { width, fluid } = this.props;

    if (fluid) {
      this.setState({
        width: (this.lineChart && this.lineChart.offsetWidth) || width,
      });
    }
  };

  /**
   * Update the chart.
   * @param {Array<ChartData>} data - chart data to consume.
   * @param {number} w - width of chart.
   * @param {number} h - height of chart.
   * @param {Margin} m - margin bounds of chart.
   * @param {Function} x - xScale.
   * @param {Function} y - yScale.
   */
  updateChart(
    data: Array<ChartData>,
    w: number,
    h: number,
    m: Margin,
    x: Function,
    y: Function,
  ) {
    const { noDataMessage, eventDispatcher } = this.props;
    const { color } = this.state;

    /** Setup container of chart. */
    const node = this.svg;
    const svg = select(node);

    svg.attr('width', w + m.left + m.right);
    svg.attr('height', h + m.top + m.bottom);
    svg.selectAll('.wrapper').remove();

    const svgEnter = svg.selectAll('wrapper').data([data]);

    const root = svgEnter
      .enter()
      .append('g')
      .attr('class', 'wrapper')
      .attr('transform', `translate(${+m.left}, ${+m.top})`);

    root.exit().remove();

    /** Add series index and key to each data point for reference. */
    chart.mapSeriesToData(data);

    /** No-data setup. */
    if (!data.length) {
      root
        .append('g')
        .attr('class', 'no-data-wrap')
        .datum(data)
        .call(
          noData()
            .width(w)
            .height(h)
            .message(noDataMessage),
        );
      return;
    }

    /** Lines setup. */
    root.append('g').attr('class', 'lines');

    root
      .select('.lines')
      .datum(data.filter(d => !d.disabled))
      .call(
        lines()
          .width(w)
          .height(h)
          .x(x)
          .y(y)
          .color(color)
          .eventDispatcher(eventDispatcher),
      );

    /** Event Handling & Dispatching. */
    eventDispatcher.on('legendClick', d => {
      this.setState({ data: d });
      this.updateChart();
    });

    eventDispatcher.on('lineClick', () => {});
    eventDispatcher.on('lineMouseOver', () => {});
    eventDispatcher.on('lineMouseOut', () => {});
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

    this.updateChart(data, w, h, m, x, y);

    return (
      <div
        ref={c => {
          this.lineChart = c;
        }}
        className="line-chart"
      >
        <svg
          ref={svg => {
            this.svg = svg;
          }}
        >
          <Legend
            data={data}
            width={width}
            height={h}
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
        </svg>
      </div>
    );
  }
}

export default LineChart;
