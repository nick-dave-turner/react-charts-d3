# react-charts-d3
A collection of easy to use charts created in D3 for your React applications.

* Bar Chart
* Line Chart

[View chart examples](https://nick-dave-turner.github.io/react-charts-d3.github.io/)

## Installation

Run

```sh
yarn add react-charts-d3
```

And import the chart types you want

```es6
import { BarChart, LineChart } from 'react-charts-d3';
```

## Charts

[Bar chart](https://nick-dave-turner.github.io/react-charts-d3.github.io/#barchart)
##### List of options available under PROPS & METHODS

```jsx
<BarChart data={data} />
```

[Line chart](https://nick-dave-turner.github.io/react-charts-d3.github.io/#linechart)
##### List of options available under PROPS & METHODS

```jsx
<LineChart data={data} />
```

## Data

```jsx
const data = [
  { key: 'Group 1', values: [ { x: 'A', y: 23 }, { x: 'B', y: 8 } ] },
  { key: 'Group 2', values: [ { x: 'A', y: 15 }, { x: 'B', y: 37 } ] },
];
```

## Contributing

Contributions are welcome. Check out [CONTRIBUTING.md](CONTRIBUTING.md)

- [Report bugs](https://github.com/nick-dave-turner/react-charts-d3/issues)


