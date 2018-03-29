import React from 'react';
import { shallow } from 'enzyme';
import NoData from '../../../src/components/NoData/NoData';

xdescribe('<NoData/>', () => {
  let component;

  beforeEach(() => {
    component = shallow(<NoData />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});