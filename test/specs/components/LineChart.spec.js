import React from 'react';
import { shallow } from 'enzyme';
import LineChart from '../../../src/components/LineChart/LineChart';

describe('<LineChart/>', () => {
  let component;

  beforeEach(() => {
    component = shallow(<LineChart />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});