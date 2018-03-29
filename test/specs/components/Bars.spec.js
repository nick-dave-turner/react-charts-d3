import React from 'react';
import { shallow } from 'enzyme';
import Bars from '../../../src/components/BarChart/Bars';

xdescribe('<Bar/>', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Bars />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});