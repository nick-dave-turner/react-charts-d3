import React from 'react';
import { shallow } from 'enzyme';
import Bubbles from '../../../src/components/BubbleChart/Bubbles';

xdescribe('<Bubbles />', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Bubbles />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});