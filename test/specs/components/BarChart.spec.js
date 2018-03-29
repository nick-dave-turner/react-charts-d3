import React from 'react';
import { shallow } from 'enzyme';
import BarChart from '../../../src/components/BarChart/BarChart';

xdescribe('<BarChart/>', () => {
  let component;

  beforeEach(() => {
    component = shallow(<BarChart />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});