import React from 'react';
import { shallow } from 'enzyme';
import Pie from '../../../src/components/PieChart/Pie';

xdescribe('<Pie />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Pie />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});