import React from 'react';
import { shallow } from 'enzyme';
import Legend from '../../../src/components/Legend/Legend';

xdescribe('<Legend />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Legend />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});