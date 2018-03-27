// @flow
import { dynamicGetSet } from '../utils/chart';
import './styles/axis.css';

type AxisOptions = {
  label: string,
  position: string,
  width: number,
  height: number,
  type: string,
};

export default function axisModel() {
  const options: AxisOptions = {
    label: '',
    position: '',
    width: 0,
    height: 0,
    type: '',
  };

  function chart(selection: () => any) {
    const axisType = options.type === '' ? 'x' : options.type;

    if (!options.position) {
      options.position = axisType === 'x' ? 'center' : 'middle';
    }

    selection.each(() => {
      const label = selection.selectAll('.label').data([options.label || null]);

      const labelEnter = label
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('transform', axisType === 'y' ? 'rotate(-90)' : '')
        .attr('y', axisType === 'y' ? 0 - 30 : 30)
        .text(d => d);

      labelEnter.exit().remove();

      switch (options.position) {
        case 'left':
          labelEnter.attr('x', 0).style('text-anchor', 'start');
          break;

        case 'right':
          labelEnter.attr('x', options.width).style('text-anchor', 'end');
          break;

        case 'center':
          labelEnter
            .attr('x', options.width / 2)
            .style('text-anchor', 'middle');
          break;

        case 'top':
          labelEnter.attr('x', 0).style('text-anchor', 'end');
          break;

        case 'bottom':
          labelEnter
            .attr('x', 0 - options.height)
            .style('text-anchor', 'start');
          break;

        case 'middle':
          labelEnter
            .attr('x', 0 - options.height / 2)
            .style('text-anchor', 'middle');
          break;

        default:
          break;
      }
    });
  }

  /** Getter / Setter for the options */
  Object.keys(options).forEach(key => {
    chart[key] = dynamicGetSet(key, chart).bind(options);
  });

  return chart;
}
