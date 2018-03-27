// @flow
import { select } from 'd3-selection';

export type Margin = {
  top?: number,
  right?: number,
  bottom?: number,
  left?: number,
};

export function updateLegend(svg: HTMLElement) {
  const legendItems = select(svg).selectAll('.legend-item');
  let prevLength = 0;

  legendItems.each(function legendLoop() {
    const item = select(this);
    const length = item
      .select('text')
      .node()
      .getComputedTextLength();
    item.attr('transform', `translate(${prevLength}, 0)`);
    prevLength = length + prevLength + 25;
  });
}
