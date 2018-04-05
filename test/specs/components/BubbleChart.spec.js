import React from 'react';
import { shallow } from 'enzyme';
import BubbleChart from '../../../src/components/BubbleChart/BubbleChart';

xdescribe('<BubbleChart />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<BubbleChart />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});