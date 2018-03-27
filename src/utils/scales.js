// @flow
import { max, extent } from 'd3-array';
import { scaleBand, scaleLinear, scaleOrdinal, scalePoint } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

export type ChartDataItem = {
  x: string,
  y: number,
  index?: number,
  series?: number,
  key?: string,
};

export type ChartData = {
  key: string,
  values: Array<ChartDataItem>,
  index?: number,
  disabled?: boolean,
};

export type ColorScale = {
  from?: string,
  to?: string,
};

export function createDomainRangeScales(
  axesScaleType: string,
  chartData: Array<ChartData>,
  dataKey: string,
  width: number,
  height: number,
): any {
  let axes;

  /** Flatten chartData array so we can work with total values of all groups */
  const data = chartData.reduce((a, b) => a.concat(b.values), []);

  switch (axesScaleType) {
    case 'band':
      axes = scaleBand();
      axes.rangeRound([0, width]);
      axes.domain(data.map(d => d[dataKey]));
      break;

    case 'linear':
      axes = scaleLinear();
      if (dataKey === 'x') {
        axes.rangeRound([0, width]);
        axes.domain(extent(data, d => d[dataKey]));
      } else {
        axes.rangeRound([height, 0]);
        axes.domain([0, max(data, d => d[dataKey])]);
      }
      break;

    case 'ordinal':
      axes = scalePoint();
      if (dataKey === 'x') {
        axes.range([0, width]);
      } else {
        axes.range([height, 0]);
      }
      axes.domain(data.map(d => d[dataKey]));
      break;

    default:
      break;
  }

  return axes;
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
