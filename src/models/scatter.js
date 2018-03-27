// @flow
import { dispatch } from 'd3-dispatch';
import { transition } from 'd3-transition';
import { dynamicGetSet } from '../utils/chart';
import './styles/lines.css';

export type LineOptions = {
  x: Function,
  y: Function,
  color: Function,
  pointSize: number,
  animate: boolean,
  duration: number,
  delay: number,
  eventDispatcher: Function,
};

export default function scatterModel() {
  const options: LineOptions = {
    x: d => d,
    y: d => d,
    color: d => d,
    pointSize: 3.5,
    animate: true,
    duration: 1000,
    delay: 300,
    eventDispatcher: dispatch(
      'scatterClick',
      'scatterMouseOver',
      'scatterMouseOut',
    ),
  };

  function chart(selection: () => any) {
    selection.each(() => {
      const group = selection.selectAll('.group').data(d => d);

      const groupEnter = group
        .enter()
        .append('g')
        .attr('class', 'group');

      groupEnter.exit().remove();

      const point = groupEnter.selectAll('.dot').data(d => d.values);

      const pointEnter = point
        .enter()
        .append('circle')
        .attr('class', 'dot');

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
        .duration(options.duration)
        .delay((d, i) => i * options.delay)
        .attr('r', options.pointSize);

      /** Event Handling & Dispatching */
      pointEnter.on('click', d => {
        options.eventDispatcher.apply('scatterClick', this, [d]);
      });

      pointEnter.on('mouseover', d => {
        options.eventDispatcher.apply('scatterMouseOver', this, [d]);
      });

      pointEnter.on('mouseover', d => {
        options.eventDispatcher.apply('scatterMouseOut', this, [d]);
      });
    });
  }

  /** Getter / Setter for the options */
  Object.keys(options).forEach(key => {
    chart[key] = dynamicGetSet(key, chart).bind(options);
  });

  return chart;
}
