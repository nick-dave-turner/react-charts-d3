import React from 'react';
import { shallow } from 'enzyme';
import Areas from '../../../src/components/AreaChart/Areas';

xdescribe('<Areas />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Areas />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});