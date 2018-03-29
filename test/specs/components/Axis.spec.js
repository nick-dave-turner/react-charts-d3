import React from 'react';
import { shallow } from 'enzyme';
import Axis from '../../../src/components/Axis/Axis';

xdescribe('<Axis/>', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Axis />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});