import React from 'react';
import { shallow } from 'enzyme';
import PieChart from '../../../src/components/PieChart/PieChart';

xdescribe('<PieChart />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<PieChart />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});