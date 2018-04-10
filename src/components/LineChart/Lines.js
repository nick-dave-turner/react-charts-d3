// @flow
import React, { PureComponent } from 'react';

import { select } from 'd3-selection';
import { dispatch } from 'd3-dispatch';
import { line as lineScale } from 'd3-shape';
import { transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';

import './lines.css';

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
  /** Size of line */
  strokeWidth?: number,
  /** Display or hide the scatter points on lines. */
  drawScatterPointers: boolean,
  /** Scatter point size. */
  pointSize: number,
  /** Display line animation effect on load. */
  animate: boolean,
  /** Duration of animation. */
  duration: number,
  /** Delay of animation before moving onto next group. */
  delay: number,
  /** Function containing eventDispatcher for interactions. */
  eventDispatcher: Function,
|};

/** Class representing Lines node */
class Lines extends PureComponent<Props> {
  static displayName = 'Lines';

  static defaultProps = {
    strokeWidth: 1.5,
    drawScatterPointers: true,
    pointSize: 2,
    animate: true,
    duration: 500,
    delay: 150,
    eventDispatcher: dispatch('lineClick', 'lineMouseOver', 'lineMouseOut'),
  };

  // Element flow types.
  lines: ?Element;

  /**
   * Animation effect for lines.
   * @param {Element} node - the lines node.
   */
  animateLines = (node: ?Element) => {
    const { animate, duration } = this.props;

    const lines = select(node).selectAll('.group');

    lines.each(function legendLoop() {
      const line = select(this);
      const length = line
        .select('path')
        .node()
        .getTotalLength();

      line
        .filter(() => animate)
        .style('stroke-dasharray', `${length} ${length}`)
        .style('stroke-dashoffset', length)
        .transition(transition)
        .duration(duration)
        .ease(easeLinear)
        .style('stroke-dashoffset', 0);
    });
  };

  /** Renders the Lines node. */
  renderLines = () => {
    const {
      data,
      color,
      x,
      y,
      strokeWidth,
      drawScatterPointers,
      pointSize,
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

    const node = this.lines;
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

    if (drawScatterPointers) {
      const point = groupEnter.selectAll('.point').data(d => d.values);

      const pointEnter = point
        .enter()
        .append('circle')
        .attr('class', 'point');

      pointEnter.exit().remove();

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
        .duration(50)
        .delay((d, i) => i * delay)
        .attr('r', pointSize);
    }

    this.animateLines(node);

    /** Event Handling & Dispatching */
    lineEnter.on('click', d => {
      // $FlowFixMe
      eventDispatcher.apply('lineClick', this, [d]);
    });

    lineEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('lineMouseOver', this, [d]);
    });

    lineEnter.on('mouseover', d => {
      // $FlowFixMe
      eventDispatcher.apply('lineMouseOut', this, [d]);
    });
  };

  render() {
    this.renderLines();
    return (
      <g
        ref={lines => {
          this.lines = lines;
        }}
        className="lines"
      />
    );
  }
}

export default Lines;
