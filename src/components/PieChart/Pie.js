// @flow
import React, { PureComponent } from 'react';

import { pie as pieScale, arc as arcScale } from 'd3-shape';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import { format } from 'd3-format';

import './pie.css';

import { PieData } from '../../utils/commonTypes';

type Props = {|
  /** Chart Data to be consumed by chart. */
  data: Array<PieData>,
  /** The width the graph or component created inside the SVG should be made. */
  width: number,
  /** The height the graph or component created inside the SVG should be made. */
  height: number,
  /** Function containing the chart or component color-scale. */
  color: Function,
  /** If true displays chart as doughnut, if false displays chart as pie. */
  displayAsDoughnut: boolean,
  /** Show or hide pie segment labels. */
  displayLabels: boolean,
  /** Sets label offset distance from the pie chart. */
  labelOffset: number,
  /** Format the value when displaying labels. */
  valueFormatter: Function,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher: Function,
|};

/** Class representing Pie node */
class Pie extends PureComponent<Props> {
  static displayName = 'Pie';

  static defaultProps = {
    width: 600,
    height: 200,
    displayAsDoughnut: true,
    displayLabels: true,
    labelOffset: 100,
    valueFormatter: format('.3n'),
    eventDispatcher: dispatch('pieClick', 'pieMouseOver', 'pieMouseOut'),
  };

  // Element flow types.
  pie: ?Element;

  /** Renders the Pie node. */
  renderPie = () => {
    const {
      data,
      width,
      height,
      color,
      displayAsDoughnut,
      displayLabels,
      labelOffset,
      valueFormatter,
      eventDispatcher,
    } = this.props;

    /** Filter out disabled data. */
    const chartData = data.filter(d => !d.disabled);

    /** Setup radius scale. */
    const radiusScale = Math.min(width, height) / 2;

    /** Setup pie scale. */
    const pie = pieScale()
      .sort(null)
      .value(d => d.value);

    /** Setup arc scale. */
    const path = arcScale()
      .innerRadius(displayAsDoughnut ? radiusScale - 50 : 0)
      .outerRadius(radiusScale - 10);

    const node = this.pie;
    const selection = select(node);

    selection.attr('transform', `translate(${width / 2}, ${height / 2})`);
    selection.selectAll('*').remove();

    /** Set up arcs. */
    const arc = selection.selectAll('.arc').data(pie(chartData));

    const arcEnter = arc
      .enter()
      .append('g')
      .attr('class', (d, i) => `arc arc-${i}`);

    arcEnter.exit().remove();

    arcEnter
      .append('path')
      .attr('d', path)
      .style('fill', d => color(d.index));

    if (displayLabels) {
      const text = arcEnter
        .append('text')
        .attr('class', 'pie-label')
        .text(d => `${d.data.label}: ${valueFormatter(d.data.value)}`);

      text
        .attr('x', d => {
          const centroid = path.centroid(d);
          const midAngle = Math.atan2(centroid[1], centroid[0]);
          const x = Math.cos(midAngle) * labelOffset;
          const sign = x > 0 ? 1 : -1;
          return x + 5 * sign;
        })
        .attr('y', d => {
          const centroid = path.centroid(d);
          const midAngle = Math.atan2(centroid[1], centroid[0]);
          return Math.sin(midAngle) * labelOffset;
        })
        .attr('text-anchor', d => {
          const centroid = path.centroid(d);
          const midAngle = Math.atan2(centroid[1], centroid[0]);
          const x = Math.cos(midAngle) * labelOffset;
          return x > 0 ? 'start' : 'end';
        });
    }

    /** Event Handling & Dispatching */
    arcEnter.on('click', d => {
      // $FlowFixMe
      eventDispatcher.apply('pieClick', this, [d]);
    });

    arcEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('pieMouseOver', this, [d]);
    });

    arcEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('pieMouseOut', this, [d]);
    });
  };

  render() {
    this.renderPie();
    return (
      <g
        ref={pie => {
          this.pie = pie;
        }}
        className="pie"
      />
    );
  }
}

export default Pie;
