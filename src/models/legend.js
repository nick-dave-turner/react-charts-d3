// @flow
import { dispatch } from 'd3-dispatch';
import { dynamicGetSet } from '../utils/chart';
import './styles/legend.css';

export type LegendOptions = {
  charToPixelValue: number,
  legendPointOffset: number,
  color: Function,
  eventDispatcher: Function,
};

export default function legendModel() {
  const options: LegendOptions = {
    charToPixelValue: 8,
    legendPointOffset: 0,
    color: d => d,
    eventDispatcher: dispatch('legendClick'),
  };

  function chart(selection: () => any) {
    selection.each(data => {
      const legend = selection.selectAll('.legend-item').data(d => d);

      const legendEnter = legend
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(${i === 0 ? 0 : i * 100}, 0)`);

      legendEnter.exit().remove();

      const legendIcon = legendEnter
        .append('rect')
        .attr('class', 'legend-icon');

      legendIcon
        .filter(d => d.disabled)
        .attr('width', 8)
        .attr('height', 8)
        .attr('x', 1)
        .attr('y', 1)
        .style('stroke', d => options.color(d.index))
        .style('stroke-width', 2)
        .style('fill', 'none');

      legendIcon
        .filter(d => !d.disabled)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', d => options.color(d.index));

      legendEnter
        .append('text')
        .attr('class', 'legend-label')
        .text(d => d.key)
        .attr('dx', 15)
        .attr('dy', 8);

      legendEnter.on('click', (d, i) => {
        let mappedData = [];

        /** Need to set disabled to true / false here to filter data */
        const disabledData = data.map((series, index) => {
          const newSeries = { ...series };
          if (i === index) {
            newSeries.disabled = !newSeries.disabled;
          }
          return newSeries;
        });

        /** if every single series  is disabled, turn all series' back on. */
        if (disabledData.every(series => series.disabled)) {
          mappedData = disabledData.map(series => {
            const newSeries = { ...series };
            newSeries.disabled = false;
            return newSeries;
          });
        } else {
          mappedData = disabledData;
        }

        options.eventDispatcher.apply('legendClick', this, [mappedData]);
      });
    });
  }

  /** Getter / Setter for the options */
  Object.keys(options).forEach(key => {
    chart[key] = dynamicGetSet(key, chart).bind(options);
  });

  return chart;
}
