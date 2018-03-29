import React from 'react';
import { shallow } from 'enzyme';
import Lines from '../../../src/components/LineChart/Lines';

xdescribe('<Lines />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Lines />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});