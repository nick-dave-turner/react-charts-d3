// @flow
import { min, max, extent } from 'd3-array';
import {
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scalePoint,
  scaleSqrt,
} from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { ChartData, ColorScale } from './commonTypes';

export function createDomainRangeScales(
  axisScaleType: string,
  chartData: Array<ChartData>,
  dataKey: string,
  width: number,
  height: number,
  scale?: number,
): any {
  let axis;

  /** Flatten chartData array so we can work with total values of all groups. */
  const data = chartData.reduce((a, b) => a.concat(b.values), []);

  switch (axisScaleType) {
    case 'band':
      axis = scaleBand();
      axis.rangeRound([0, width]);
      axis.domain(data.map(d => d[dataKey]));
      break;

    case 'linear':
      axis = scaleLinear();
      const minValue = min(data, d => d[dataKey]);
      if (dataKey === 'x') {
        axis.rangeRound([0, width]);
        axis.domain(extent(data, d => d[dataKey]));
      } else {
        axis.rangeRound([height, 0]);
        axis.domain([minValue < 0 ? minValue : 0, max(data, d => d[dataKey])]);
      }
      break;

    case 'ordinal':
      axis = scalePoint();
      if (dataKey === 'x') {
        axis.range([0, width]);
      } else {
        axis.range([height, 0]);
      }
      axis.domain(data.map(d => d[dataKey]));
      break;

    case 'sqrt':
      axis = scaleSqrt();
      axis.rangeRound([1, scale]);
      axis.domain([min(data, d => d[dataKey]), max(data, d => d[dataKey])]);
      break;

    default:
      break;
  }

  return axis;
}

export function calculateColorScale(
  length: number,
  useColorScale?: boolean = false,
  colors?: ColorScale = {},
): () => any {
  let color: any;

  if (useColorScale) {
    color = scaleLinear()
      .domain([0, length - 1])
      .range([colors.from, colors.to]);
  } else {
    color = scaleOrdinal(schemeCategory10);
  }

  return color;
}
