import React from 'react';
import { shallow } from 'enzyme';
import AreaChart from '../../../src/components/AreaChart/AreaChart';

xdescribe('<AreaChart />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<AreaChart />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});