// @flow
import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import { line as lineScale, area as areaScale } from 'd3-shape';
import { transition } from 'd3-transition';

import './areas.css';

import { ChartData } from '../../utils/commonTypes';

type Props = {|
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** The height the graph or component created inside the SVG should be made. */
  height: number,
  /** Function containing X Scale created by scales.createDomainRangeScales() */
  x: Function,
  /** Function containing Y Scale created by scales.createDomainRangeScales() */
  y: Function,
  /** Function containing the chart or component color-scale. */
  color: Function,
  /** Size of line */
  strokeWidth: number,
  /** Display area animation effect on load. */
  animate: boolean,
  /** Duration of animation. */
  duration: number,
  /** Delay of animation before moving onto next group. */
  delay: number,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher: Function,
|};

/** Class representing Areas node */
class Areas extends PureComponent<Props> {
  static displayName = 'Areas';

  static defaultProps = {
    height: 200,
    strokeWidth: 1.5,
    animate: true,
    duration: 500,
    delay: 50,
    eventDispatcher: dispatch('areaClick', 'areaMouseOver', 'areaMouseOut'),
  };

  // Element flow types.
  areas: ?Element;

  /** Renders the Areas node. */
  renderAreas = () => {
    const {
      data,
      height,
      x,
      y,
      color,
      strokeWidth,
      duration,
      animate,
      delay,
      eventDispatcher,
    } = this.props;

    /** Filter out disabled data. */
    const chartData = data.filter(d => !d.disabled);

    /** Setup line scale. */
    const linePath = lineScale();
    linePath.x(d => x(d.x));
    linePath.y(d => y(d.y));

    /** Setup area scale. */
    const areaPath = (datum, boolean) =>
      areaScale()
        .y0(height)
        .y1(d => (boolean ? y(d.y) : height))
        .x(d => x(d.x))(datum);

    const node = this.areas;
    const selection = select(node);

    selection.selectAll('*').remove();

    /** Set up groups. */
    const group = selection.selectAll('.group').data(chartData);

    const groupEnter = group
      .enter()
      .append('g')
      .attr('class', 'group');

    groupEnter.exit().remove();

    /** Set up lines. */
    const line = groupEnter.selectAll('.line').data(d => [d.values]);

    const lineEnter = line
      .enter()
      .append('path')
      .attr('class', (d, i) => `line line-${i}`);

    lineEnter.exit().remove();

    /** Set up each line. */
    lineEnter
      .attr('d', linePath)
      .style('fill', 'none')
      .style('stroke', d => color(d[0].index))
      .style('stroke-width', strokeWidth);

    /** Animate lines on load */
    lineEnter
      .filter(() => animate)
      .style('opacity', 0)
      .transition(transition)
      .duration(duration * 2.5)
      .delay((d, i) => i * delay)
      .style('opacity', 1);

    /** Set up areas. */
    const area = groupEnter.selectAll('.area').data(d => [d.values]);

    const areaEnter = area
      .enter()
      .append('path')
      .attr('class', (d, i) => `area area-${i}`);

    areaEnter.exit().remove();

    /** Set up each area shape. */
    areaEnter.style('fill', d => color(d[0].index));

    /** Animate areas on load */
    areaEnter
      .filter(() => animate)
      .attr('d', d => areaPath(d, false))
      .transition(transition)
      .duration(duration)
      .delay((d, i) => i * delay)
      .attr('d', d => areaPath(d, true));

    /** Static areas on load */
    areaEnter.filter(() => !animate).attr('d', d => areaPath(d, true));

    /** Event Handling & Dispatching */
    areaEnter.on('click', d => {
      // $FlowFixMe
      eventDispatcher.apply('areaClick', this, [d]);
    });

    areaEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('areaMouseOver', this, [d]);
    });

    areaEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('areaMouseOut', this, [d]);
    });
  };

  render() {
    this.renderAreas();
    return (
      <g
        ref={areas => {
          this.areas = areas;
        }}
        className="areas"
      />
    );
  }
}

export default Areas;
