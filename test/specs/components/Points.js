import React from 'react';
import { shallow } from 'enzyme';
import Points from '../../../src/components/ScatterChart/Points';

xdescribe('<Points />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Points />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});