// @flow
import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import { format } from 'd3-format';

import Pie from './Pie';
import NoData from '../NoData/NoData';

import * as chart from '../../utils/chart';
import * as scales from '../../utils/scales';

import type { PieData, Margin, ColorScale } from '../../utils/commonTypes';

type Props = {|
  /** Chart Data to be consumed by chart. */
  data: Array<PieData>,
  /** The width the graph or component created inside the SVG should be made. */
  width: number,
  /** The height the graph or component created inside the SVG should be made. */
  height: number,
  /** Object containing the margins for the chart or component. You can specify only certain margins in the object to change just those parts. */
  margin: Margin,
  /** Enable / disable gradient color effect. */
  useColorScale: boolean,
  /** Override the default colour scale. For use when useColorScale is enabled. */
  colorScale: ColorScale,
  /** Override the default color scheme. See d3-scale-chromatic for schemes. */
  colorSchemeCategory: any,
  /** If true displays chart as doughnut, if false displays chart as pie. */
  displayAsDoughnut: boolean,
  /** Show or hide pie segment labels. */
  displayLabels: boolean,
  /** Sets label offset distance from the pie chart. */
  labelOffset: number,
  /** Format the value when displaying labels. */
  valueFormatter: Function,
  /** Enable / disable responsive chart width. */
  fluid: boolean,
  /** Message to display if no data is provided. */
  noDataMessage: string,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher: Function,
|};

type State = {|
  data: Array<PieData>,
  width: number,
  color: Function,
|};

/** Class representing a Pie chart. */
class PieChart extends PureComponent<Props, State> {
  static displayName = 'PieChart';

  static defaultProps = {
    width: 600,
    height: 200,
    margin: { top: 10, left: 0, bottom: 10, right: 0 },
    useColorScale: true,
    colorScale: { from: '#008793', to: '#00bf72' },
    colorSchemeCategory: [],
    displayAsDoughnut: false,
    displayLabels: true,
    labelOffset: 90,
    valueFormatter: format('.3n'),
    fluid: true,
    noDataMessage: 'No Data Available.',
    eventDispatcher: dispatch(
      'legendClick',
      'pieClick',
      'pieMouseOver',
      'pieMouseOut',
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
  pieChart: ?HTMLElement;
  svg: ?Element;

  /** Updates the width to browser dimensions. */
  updateDimensions = () => {
    const { width, fluid } = this.props;

    if (fluid) {
      this.setState({
        width: (this.pieChart && this.pieChart.offsetWidth) || width,
      });
    }
  };

  /**
   * Update the chart.
   * @param {number} w - width of chart.
   * @param {number} h - height of chart.
   * @param {Margin} m - margin bounds of chart.
   */
  updateChart(w: number, h: number, m: Margin) {
    const { eventDispatcher } = this.props;

    /** Setup container of chart. */
    const node = this.svg;
    const svg = select(node);

    svg
      .attr('width', w + m.left + m.right)
      .attr('height', h + m.top + m.bottom)
      .selectAll('.wrapper')
      .attr('transform', `translate(${+m.left}, ${+m.top})`);

    /** Event Handling & Dispatching. */
    eventDispatcher.on('legendClick', d => this.setState({ data: d }));
    eventDispatcher.on('pieClick', () => {});
    eventDispatcher.on('pieMouseOver', () => {});
    eventDispatcher.on('pieMouseOut', () => {});
  }

  render() {
    const { data, width, color } = this.state;

    const {
      height,
      margin,
      displayAsDoughnut,
      displayLabels,
      labelOffset,
      valueFormatter,
      noDataMessage,
      eventDispatcher,
    } = this.props;

    const { w, h, m } = chart.calculateChartValues(
      data.filter(d => !d.disabled),
      width,
      height,
      margin,
    );

    this.updateChart(w, h, m);

    return (
      <div
        ref={c => {
          this.pieChart = c;
        }}
        className="pie-chart"
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
              <Pie
                data={data}
                width={width}
                height={h}
                color={color}
                displayAsDoughnut={displayAsDoughnut}
                displayLabels={displayLabels}
                labelOffset={labelOffset}
                valueFormatter={valueFormatter}
                eventDispatcher={eventDispatcher}
              />
            </g>
          )}
        </svg>
      </div>
    );
  }
}

export default PieChart;
