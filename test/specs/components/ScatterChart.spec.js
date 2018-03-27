import React from 'react';
import { shallow } from 'enzyme';
import ScatterChart from '../../../src/components/ScatterChart/ScatterChart';

describe('<ScatterChart/>', () => {
  let component;

  beforeEach(() => {
    component = shallow(<ScatterChart />);
  });

  it('should render component', () => {
    expect(component.length).toBe(1);
  });
});