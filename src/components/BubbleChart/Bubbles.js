// @flow
import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import { transition } from 'd3-transition';

import './bubbles.css';

import { ChartData } from '../../utils/commonTypes';

type Props = {|
  /** Chart Data to be consumed by chart. */
  data: Array<ChartData>,
  /** Function containing X Scale created by scales.createDomainRangeScales() */
  x: Function,
  /** Function containing Y Scale created by scales.createDomainRangeScales() */
  y: Function,
  /** Function containing R Scale created by scales.createDomainRangeScales() */
  r: Function,
  /** Function containing the chart or component color-scale. */
  color: Function,
  /** Display bubble animation effect on load. */
  animate: boolean,
  /** Duration of animation. */
  duration: number,
  /** Delay of animation before moving onto next group. */
  delay: number,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher: Function,
|};

/** Class representing Bubbles node */
class Bubbles extends PureComponent<Props> {
  static displayName = 'Bubbles';

  static defaultProps = {
    animate: true,
    duration: 500,
    delay: 100,
    eventDispatcher: dispatch(
      'bubbleClick',
      'bubbleMouseOver',
      'bubbleMouseOut',
    ),
  };

  // Element flow types.
  bubbles: ?Element;

  /** Renders the Bubbles node. */
  renderBubbles = () => {
    const {
      data,
      color,
      x,
      y,
      r,
      animate,
      duration,
      delay,
      eventDispatcher,
    } = this.props;

    /** Filter out disabled data. */
    const chartData = data.filter(d => !d.disabled);

    const node = this.bubbles;
    const selection = select(node);

    selection.selectAll('*').remove();

    /** Set up groups. */
    const group = selection.selectAll('.group').data(chartData);

    const groupEnter = group
      .enter()
      .append('g')
      .attr('class', 'group');

    groupEnter.exit().remove();

    /** Set up bubbles. */
    const bubble = groupEnter.selectAll('.bubble').data(d => d.values);

    const bubbleEnter = bubble
      .enter()
      .append('circle')
      .attr('class', (d, i) => `bubble bubble-${i}`);

    bubbleEnter.exit().remove();

    /** Set up each bubble. */
    bubbleEnter
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', d => r(d.r))
      .style('fill', d => color(d.index));

    /** Animate bubbles on load */
    bubbleEnter
      .filter(() => animate)
      .attr('r', 0)
      .transition(transition)
      .duration(duration)
      .delay((d, i) => i * delay)
      .attr('r', d => r(d.r));

    /** Event Handling & Dispatching */
    bubbleEnter.on('click', d => {
      // $FlowFixMe
      eventDispatcher.apply('bubbleClick', this, [d]);
    });

    bubbleEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('bubbleMouseOver', this, [d]);
    });

    bubbleEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('bubbleMouseOut', this, [d]);
    });
  };

  render() {
    this.renderBubbles();
    return (
      <g
        ref={bubbles => {
          this.bubbles = bubbles;
        }}
        className="bubbles"
      />
    );
  }
}

export default Bubbles;
