import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import { transition } from 'd3-transition';

import './bars.css';

import { ChartData } from '../../utils/commonTypes';

type Props = {
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** The height the graph or component created inside the SVG should be made. */
  height?: number,
  /** Function containing the chart or component color-scale. */
  color: Function,
  /** Function containing X Scale created by scales.createDomainRangeScales() */
  x: Function,
  /** Function containing Y Scale created by scales.createDomainRangeScales() */
  y: Function,
  /** Display bar animation effect on load. */
  animate?: boolean,
  /** Duration of animation. */
  duration?: number,
  /** Delay of animation before moving onto next group. */
  delay?: number,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher?: Function,
};

/** Class representing Bars node. */
class Bars extends PureComponent<Props> {
  static displayName = 'Bars';

  static defaultProps = {
    height: 200,
    animate: true,
    duration: 500,
    delay: 50,
    eventDispatcher: dispatch('barClick', 'barMouseOver', 'barMouseOut'),
  };

  /** Renders the Bars node. */
  renderBars = () => {
    const {
      data,
      height,
      color,
      x,
      y,
      animate,
      duration,
      delay,
      eventDispatcher,
    } = this.props;

    /** Filter out disabled data. */
    const chartData = data.filter(d => !d.disabled);

    const node = this.bars;
    const selection = select(node);

    selection.selectAll('*').remove();

    /** Set up groups. */
    const group = selection.selectAll('.group').data(chartData);

    const groupEnter = group
      .enter()
      .append('g')
      .attr('class', 'group');

    groupEnter.exit().remove();

    /** Set up bars. */
    const bar = groupEnter.selectAll('.bar').data(d => d.values);

    const barEnter = bar
      .enter()
      .append('rect')
      .attr('class', (d, i) => `bar bar-${i}`);

    barEnter.exit().remove();

    /** Set up each bar. */
    barEnter
      .attr(
        'x',
        d => x(d.x) + d.series * (x.bandwidth() + 2) / chartData.length,
      )
      .attr('y', height)
      .attr('width', x.bandwidth() / chartData.length)
      .attr('height', 0)
      .style('fill', d => color(d.index));

    /** Animate bars on load */
    barEnter
      .filter(() => animate)
      .transition(transition)
      .duration(duration)
      .delay((d, i) => i * delay)
      .attr('y', d => y(d.y))
      .attr('height', d => height - y(d.y));

    /** Static bars on load */
    barEnter
      .filter(() => !animate)
      .attr('y', d => y(d.y))
      .attr('height', d => height - y(d.y));

    /** Event Handling & Dispatching */
    barEnter.on('click', d => {
      eventDispatcher.apply('barClick', this, [d]);
    });

    barEnter.on('mouseover', d => {
      eventDispatcher.apply('barMouseOver', this, [d]);
    });

    barEnter.on('mouseover', d => {
      eventDispatcher.apply('barMouseOut', this, [d]);
    });
  };

  render() {
    this.renderBars();
    return (
      <g
        ref={bars => {
          this.bars = bars;
        }}
        className="bars"
      />
    );
  }
}

export default Bars;
