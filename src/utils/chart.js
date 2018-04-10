// @flow
import * as scales from './scales';

import type { ChartData, Margin } from './commonTypes';

export function calculateChartValues(
  data: Array<ChartData>,
  width: number,
  height: number,
  margin: Margin,
  xScaleType: string,
  yScaleType: string,
  rScaleType?: string,
  rScale?: number = 1,
) {
  const w: number = width - +margin.left - +margin.right;
  const h: number = height - +margin.top - +margin.bottom;
  const m: Margin = margin;

  const x: any = scales.createDomainRangeScales(xScaleType, data, 'x', w, h);
  const y: any = scales.createDomainRangeScales(yScaleType, data, 'y', w, h);

  let r: any = null;

  if (rScaleType) {
    r = scales.createDomainRangeScales(rScaleType, data, 'r', w, h, rScale);
  }

  return {
    w,
    h,
    m,
    x,
    y,
    r,
  };
}

export function mapSeriesToData(chartData: Array<ChartData>): Array<ChartData> {
  chartData.map((series, i) => {
    const data = series;
    data.index = i;

    data.values.map(dataPoint => {
      const values = dataPoint;
      values.index = i;
      values.key = series.key;
      return values;
    });

    return data;
  });

  chartData.filter(d => !d.disabled).map((series, i) => {
    const data = series;

    data.values.map(dataPoint => {
      const values = dataPoint;
      values.series = i;
      return values;
    });

    return data;
  });

  return chartData;
}
