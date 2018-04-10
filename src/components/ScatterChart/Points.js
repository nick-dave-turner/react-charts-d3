// @flow
import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import { transition } from 'd3-transition';

import './scatter.css';

import { ChartData } from '../../utils/commonTypes';

type Props = {|
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** Function containing X Scale created by scales.createDomainRangeScales() */
  x: Function,
  /** Function containing Y Scale created by scales.createDomainRangeScales() */
  y: Function,
  /** Function containing the chart or component color-scale. */
  color: Function,
  /** Scatter point size. */
  pointSize: number,
  /** Display point animation effect on load. */
  animate: boolean,
  /** Duration of animation. */
  duration: number,
  /** Delay of animation before moving onto next group. */
  delay: number,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher: Function,
|};

/** Class representing Points node */
class Points extends PureComponent<Props> {
  static displayName = 'Points';

  static defaultProps = {
    pointSize: 3.5,
    animate: true,
    duration: 500,
    delay: 100,
    eventDispatcher: dispatch('pointClick', 'pointMouseOver', 'pointMouseOut'),
  };

  // Element flow types.
  points: ?Element;

  /** Renders the Points node. */
  renderPoints = () => {
    const {
      data,
      color,
      x,
      y,
      pointSize,
      animate,
      duration,
      delay,
      eventDispatcher,
    } = this.props;

    /** Filter out disabled data. */
    const chartData = data.filter(d => !d.disabled);

    const node = this.points;
    const selection = select(node);

    selection.selectAll('*').remove();

    /** Set up groups. */
    const group = selection.selectAll('.group').data(chartData);

    const groupEnter = group
      .enter()
      .append('g')
      .attr('class', 'group');

    groupEnter.exit().remove();

    /** Set up Points. */
    const point = groupEnter.selectAll('.point').data(d => d.values);

    const pointEnter = point
      .enter()
      .append('circle')
      .attr('class', (d, i) => `point point-${i}`);

    pointEnter.exit().remove();

    /** Set up each point. */
    pointEnter
      .attr('r', pointSize)
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .style('fill', d => color(d.index));

    /** Animate points on load */
    pointEnter
      .filter(() => animate)
      .attr('r', 0)
      .transition(transition)
      .duration(duration)
      .delay((d, i) => i * delay)
      .attr('r', pointSize);

    /** Event Handling & Dispatching */
    pointEnter.on('click', d => {
      // $FlowFixMe
      eventDispatcher.apply('pointClick', this, [d]);
    });

    pointEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('pointMouseOver', this, [d]);
    });

    pointEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('pointMouseOut', this, [d]);
    });
  };

  render() {
    this.renderPoints();
    return (
      <g
        ref={points => {
          this.points = points;
        }}
        className="points"
      />
    );
  }
}

export default Points;
