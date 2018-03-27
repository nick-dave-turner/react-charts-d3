// @flow
import { dispatch } from 'd3-dispatch';
import { transition } from 'd3-transition';
import { dynamicGetSet } from '../utils/chart';
import './styles/bars.css';

export type BarOptions = {
  width: number,
  height: number,
  barPadding: number,
  x: Function,
  y: Function,
  color: Function,
  animate: boolean,
  duration: number,
  delay: number,
  eventDispatcher: Function,
};

export default function barModel() {
  const options: BarOptions = {
    width: 0,
    height: 0,
    barPadding: 0,
    x: d => d,
    y: d => d,
    color: d => d,
    animate: true,
    duration: 500,
    delay: 50,
    eventDispatcher: dispatch('barClick', 'barMouseOver', 'barMouseOut'),
  };

  function chart(selection: () => any) {
    selection.each(data => {
      const group = selection.selectAll('.group').data(d => d);

      const groupEnter = group
        .enter()
        .append('g')
        .attr('class', 'group');

      groupEnter.exit().remove();

      const bar = groupEnter.selectAll('.bar').data(d => d.values);

      const barEnter = bar
        .enter()
        .append('rect')
        .attr('class', (d, i) => `bar bar-${i}`);

      barEnter.exit().remove();

      barEnter
        .attr(
          'x',
          d =>
            options.x(d.x) +
            d.series * (options.x.bandwidth() + 2) / data.length,
        )
        .attr('y', options.height)
        .attr('width', options.x.bandwidth() / data.length)
        .attr('height', 0)
        .style('fill', d => options.color(d.index));

      /** Animate bars on load */
      barEnter
        .filter(() => options.animate)
        .transition(transition)
        .duration(options.duration)
        .delay((d, i) => i * options.delay)
        .attr('y', d => options.y(d.y))
        .attr('height', d => options.height - options.y(d.y));

      /** Static bars on load */
      barEnter
        .filter(() => !options.animate)
        .attr('y', d => options.y(d.y))
        .attr('height', d => options.height - options.y(d.y));

      /** Event Handling & Dispatching */
      barEnter.on('click', d => {
        options.eventDispatcher.apply('barClick', this, [d]);
      });

      barEnter.on('mouseover', d => {
        options.eventDispatcher.apply('barMouseOver', this, [d]);
      });

      barEnter.on('mouseover', d => {
        options.eventDispatcher.apply('barMouseOut', this, [d]);
      });
    });
  }

  /** Getter / Setter for the options */
  Object.keys(options).forEach(key => {
    chart[key] = dynamicGetSet(key, chart).bind(options);
  });

  return chart;
}
