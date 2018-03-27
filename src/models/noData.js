// @flow
import { dynamicGetSet } from '../utils/chart';
import './styles/noData.css';

export type NoDataOptions = {
  message: string,
  width: number,
  height: number,
};

export default function noDataModel() {
  const options: NoDataOptions = {
    message: 'No Data Available.',
    width: 0,
    height: 0,
  };

  function chart(selection: () => any) {
    selection.each(() => {
      const message = selection.selectAll('.no-data').data([options.message]);

      const messageEnter = message
        .enter()
        .append('g')
        .attr('class', 'no-data');

      messageEnter.exit().remove();

      messageEnter
        .append('text')
        .text(d => d)
        .attr('x', options.width / 2)
        .attr('y', options.height / 2);
    });
  }

  /** Getter / Setter for the options */
  Object.keys(options).forEach(key => {
    chart[key] = dynamicGetSet(key, chart).bind(options);
  });

  return chart;
}
