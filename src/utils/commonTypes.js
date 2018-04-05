export type ChartDataItem = {
  /** Item key. */
  x: string,
  /** Item value. */
  y: number,
  /** Item radius. */
  r?: number,
  /** Item index. */
  index?: number,
  /** Group item belongs too. */
  series?: number,
  /** Name of group item belongs too. */
  key?: string,
};

export type ChartData = {
  /** Group name. */
  key: string,
  /** Group values. */
  values: Array<ChartDataItem>,
  /** Group index. */
  index?: number,
  /** Is the group disabled or not. */
  disabled?: boolean,
};

export interface Margin {
  /** Top margin value. */
  top?: number;
  /** Right margin value. */
  right?: number;
  /** Bottom margin value. */
  bottom?: number;
  /** Left margin value. */
  left?: number;
}

export interface AxisConfig {
  /** Display or hide the X axis. */
  showXAxis?: boolean;
  /** Display or hide the X axis label. */
  showXAxisLabel?: boolean;
  /** X axis label. */
  xLabel?: string;
  /** Position of X axis label - left / center / right. */
  xLabelPosition?: string;
  /** Display or hide the Y axis. */
  showYAxis?: boolean;
  /** Display or hide the Y axis label. */
  showYAxisLabel?: boolean;
  /** Y axis label. */
  yLabel?: string;
  /** Position of Y axis label - top / middle / bottom. */
  yLabelPosition?: string;
}

export interface ColorScale {
  /** From Hex value. */
  from?: string;
  /** To Hex value. */
  to?: string;
}
