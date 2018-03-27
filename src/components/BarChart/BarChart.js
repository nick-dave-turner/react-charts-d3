import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import { axisBottom, axisLeft } from 'd3-axis';

import * as dom from '../../utils/dom';
import * as chart from '../../utils/chart';
import * as scales from '../../utils/scales';

import bars from '../../models/bar';
import noData from '../../models/noData';
import legend from '../../models/legend';
import axisLabel from '../../models/axis';

import type { Margin } from '../../utils/dom';
import type { ChartData } from '../../utils/scales';
import type { AxisLabels } from '../../utils/chart';

type Props = {
  /** Chart Data to be consumed by chart */
  data: Array<ChartData>,
  /** The width the graph or component created inside the SVG should be made. */
  width?: number,
  /** The height the graph or component created inside the SVG should be made. */
  height?: number,
  /** Object containing the margins for the chart or component. You can specify only certain margins in the object to change just those parts. */
  margin?: Margin,
  /** Display or hide the Legend */
  showLegend?: boolean,
  /** Display or hide the X axis */
  showXAxis?: boolean,
  /** Display or hide the Y axis */
  showYAxis?: boolean,
  /** Display or hide the axis grid */
  showGrid?: boolean,
  /** Override the default scale type for the X axis */
  xScaleType?: string,
  /** Override the default scale type for the Y axis */
  yScaleType?: string,
  /** Object that defines the axis values */
  axisLabels?: AxisLabels,
  /** If format is specified, sets the tick format function and returns the axis. See d3-format and d3-time-format for help. */
  tickFormat?: string,
  /** Enable / disable gradient color effect */
  useColorScale?: boolean,
  /** Override the default colour scale. For use when useColorScale is enabled */
  colorScale?: scales.ColorScale,
  /** Override the default color scheme. See d3-scale-chromatic for schemes */
  colorSchemeCategory?: any,
  /** Enable / disable responsive chart width */
  fluid?: boolean,
  /** Message to display if no data is provided */
  noDataMessage?: string,
  /** Spacing between each bar */
  barSpacing?: number,
};

type State = {
  data: Array<ChartData>,
  width: number,
};

/**
 * D3/React Bar chart
 */
class BarChart extends PureComponent<Props, State> {
  static displayName = 'BarChart';

  static defaultProps = {
    width: 600,
    height: 200,
    margin: { top: 20, left: 40, bottom: 30, right: 10 },
    showLegend: true,
    showXAxis: true,
    showYAxis: true,
    showGrid: true,
    xScaleType: 'band',
    yScaleType: 'linear',
    axisLabels: {
      xLabel: 'X Axis',
      xLabelPosition: 'right',
      yLabel: 'Y Axis',
      yLabelPosition: 'top',
    },
    tickFormat: '',
    useColorScale: true,
    colorScale: { from: '#008793', to: '#00bf72' },
    colorSchemeCategory: false,
    fluid: true,
    noDataMessage: 'No Data Available.',
    barSpacing: 0.05,
  };

  state = {
    data: this.props.data || [],
    width: this.props.fluid ? 0 : this.props.width,
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const { width, fluid } = this.props;
    if (fluid) {
      this.setState({
        width: (this.barChart && this.barChart.offsetWidth) || width,
      });
    }
  };

  updateChart(data, { w, h, m, x, y }) {
    const {
      showLegend,
      showXAxis,
      showYAxis,
      showGrid,
      tickFormat,
      useColorScale,
      colorScale,
      colorSchemeCategory,
      barSpacing,
      noDataMessage,
      axisLabels,
    } = this.props;

    const { xLabel, xLabelPosition, yLabel, yLabelPosition } = axisLabels;

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

    /** Dispatching events. */
    const eventDispatcher = dispatch(
      'barClick',
      'barMouseOver',
      'barMouseOut',
      'legendClick',
    );

    /** Add series index and key to each data point for reference. */
    chart.mapSeriesToData(data);

    /** Spacing between groups of bars. */
    x.padding(barSpacing);

    /** Color scale setup. */
    const color: any = scales.calculateColorScale(
      data.length,
      useColorScale,
      colorScale,
      colorSchemeCategory,
    );

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

    /** Legend setup. */
    if (showLegend) {
      root.append('g').attr('class', 'legend');

      root
        .select('.legend')
        .datum(data)
        .call(
          legend()
            .color(color)
            .eventDispatcher(eventDispatcher),
        )
        .attr('transform', `translate(0, ${-m.top})`);
    }

    /** X-Axis setup. */
    if (showXAxis) {
      const xAxis: any = root
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0, ${h})`)
        .datum(data);

      xAxis.call(axisBottom(x));

      xAxis.call(
        axisLabel()
          .label(xLabel)
          .position(xLabelPosition)
          .width(w),
      );

      xAxis
        .filter(() => showGrid)
        .append('g')
        .attr('class', 'grid x-grid')
        .call(
          axisBottom(x)
            .tickSize(-h, 0, 0)
            .tickFormat(''),
        );
    }

    /** Y-Axis setup. */
    if (showYAxis) {
      const yAxis: any = root
        .append('g')
        .attr('class', 'axis y-axis')
        .datum(data);

      yAxis.call(axisLeft(y).ticks(10, tickFormat));

      yAxis.call(
        axisLabel()
          .label(yLabel)
          .position(yLabelPosition)
          .type('y')
          .height(h),
      );

      yAxis
        .filter(() => showGrid)
        .append('g')
        .attr('class', 'grid y-grid')
        .call(
          axisLeft(y)
            .tickSize(-w - 1, 0, 0)
            .tickFormat(''),
        );
    }

    /** Bars setup. */
    root.append('g').attr('class', 'bars');

    root
      .select('.bars')
      .datum(data.filter(d => !d.disabled))
      .call(
        bars()
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
      dom.updateLegend(this.svg);
    });

    eventDispatcher.on('barClick', () => {});
    eventDispatcher.on('barMouseOver', () => {});
    eventDispatcher.on('barMouseOut', () => {});
  }

  render() {
    const { data, width } = this.state;
    const { height, margin, xScaleType, yScaleType } = this.props;

    const { w, h, m, x, y } = chart.calculateChartValues(
      data.filter(d => !d.disabled),
      width,
      height,
      margin,
      xScaleType,
      yScaleType,
    );

    this.updateChart(data, { w, h, m, x, y });

    /** Enable dynamic width legend items */
    dom.updateLegend(this.svg);

    return (
      <div
        ref={c => {
          this.barChart = c;
        }}
        className="bar-chart"
      >
        <svg
          ref={svg => {
            this.svg = svg;
          }}
        />
      </div>
    );
  }
}

export default BarChart;
