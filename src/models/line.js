// @flow
import { line as lineScale } from 'd3-shape';
import { dispatch } from 'd3-dispatch';
import { transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';
import { dynamicGetSet } from '../utils/chart';
import './styles/lines.css';

export type LineOptions = {
  width: number,
  height: number,
  x: Function,
  y: Function,
  color: Function,
  strokeWidth: number,
  pointSize: number,
  drawScatterPointers: boolean,
  animate: boolean,
  duration: number,
  delay: number,
  eventDispatcher: Function,
};

export default function lineModel() {
  const options: LineOptions = {
    width: 0,
    height: 0,
    x: d => d,
    y: d => d,
    color: d => d,
    strokeWidth: 1.5,
    pointSize: 2,
    drawScatterPointers: true,
    animate: true,
    duration: 1000,
    delay: 300,
    eventDispatcher: dispatch('lineClick', 'lineMouseOver', 'lineMouseOut'),
  };

  function chart(selection: () => any) {
    selection.each(() => {
      /** Setup points for line scale. */
      const path = lineScale();
      path.x(d => options.x(d.x));
      path.y(d => options.y(d.y));

      const group = selection.selectAll('.group').data(d => d);

      const groupEnter = group
        .enter()
        .append('g')
        .attr('class', 'group');

      groupEnter.exit().remove();

      const line = groupEnter.selectAll('.line').data(d => [d.values]);

      const lineEnter = line
        .enter()
        .append('path')
        .attr('class', (d, i) => `line line-${i}`);

      lineEnter.exit().remove();

      lineEnter
        .attr('d', path)
        .style('fill', 'none')
        .style('stroke', d => options.color(d[0].index))
        .style('stroke-width', options.strokeWidth);

      const totalLength = lineEnter.node().getTotalLength();

      /** Animate line on load */
      lineEnter
        .filter(() => options.animate)
        .style('stroke-dasharray', `${totalLength} ${totalLength}`)
        .style('stroke-dashoffset', totalLength)
        .transition(transition)
        .duration(options.duration)
        .ease(easeLinear)
        .style('stroke-dashoffset', 0);

      /** Add the scatter-points to lines if enabled */
      if (options.drawScatterPointers) {
        const point = groupEnter.selectAll('.point').data(d => d.values);

        const pointEnter = point
          .enter()
          .append('circle')
          .attr('class', 'point');

        pointEnter.exit().remove();

        pointEnter
          .attr('r', options.pointSize)
          .attr('cx', d => options.x(d.x))
          .attr('cy', d => options.y(d.y))
          .style('fill', d => options.color(d.index));

        /** Animate points on load */
        pointEnter
          .filter(() => options.animate)
          .attr('r', 0)
          .transition(transition)
          .duration(50)
          .delay((d, i) => i * options.delay)
          .attr('r', options.pointSize);
      }

      /** Event Handling & Dispatching */
      lineEnter.on('click', d => {
        options.eventDispatcher.apply('lineClick', this, [d]);
      });

      lineEnter.on('mouseover', d => {
        options.eventDispatcher.apply('lineMouseOver', this, [d]);
      });

      lineEnter.on('mouseover', d => {
        options.eventDispatcher.apply('lineMouseOut', this, [d]);
      });
    });
  }

  /** Getter / Setter for the options */
  Object.keys(options).forEach(key => {
    chart[key] = dynamicGetSet(key, chart).bind(options);
  });

  return chart;
}
