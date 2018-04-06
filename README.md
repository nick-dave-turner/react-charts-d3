# react-charts-d3
A collection of easy to use charts created in D3 for your React applications.

* Area Chart
* Bar Chart
* Line Chart
* Scatter Chart
* Bubble Chart

[View chart examples](https://nick-dave-turner.github.io/react-charts-d3.github.io/)

## Installation

Run

```sh
yarn add react-charts-d3
```

And import the chart types you want

```es6
import { BarChart } from 'react-charts-d3';
```

## Charts

[Area chart](https://nick-dave-turner.github.io/react-charts-d3.github.io/#areachart)

```jsx
<AreaChart data={data} />
```

[Bar chart](https://nick-dave-turner.github.io/react-charts-d3.github.io/#barchart)

```jsx
<BarChart data={data} />
```

[Bubble chart](https://nick-dave-turner.github.io/react-charts-d3.github.io/#bubblechart)

```jsx
<BubbleChart data={data} />
```

[Line chart](https://nick-dave-turner.github.io/react-charts-d3.github.io/#linechart)

```jsx
<LineChart data={data} />
```

[Scatter chart](https://nick-dave-turner.github.io/react-charts-d3.github.io/#scatterchart)

```jsx
<ScatterChart data={data} />
```

##### Full list of options for each chart is available under PROPS & METHODS in the example guide.

## Data Structures

#### Area / Bar / Line / Scatter Charts

```jsx
const data = [
  { key: 'Group 1', values: [ { x: 'A', y: 23 }, { x: 'B', y: 8 } ] },
  { key: 'Group 2', values: [ { x: 'A', y: 15 }, { x: 'B', y: 37 } ] },
];
```

#### Bubble Chart

```jsx
const data = [
  { key: 'Group 1', values: [ { x: 'A', y: 23, r: 4 }, { x: 'B', y: 8, r: 19 } ] },
  { key: 'Group 2', values: [ { x: 'A', y: 15, r: 11 }, { x: 'B', y: 37, r: 21 } ] },
];
```

## Changelog

Check out [CHANGELOG.md](CHANGELOG.md)

## Contributing

Contributions are welcome. Check out [CONTRIBUTING.md](CONTRIBUTING.md)

- [Report bugs here.](https://github.com/nick-dave-turner/react-charts-d3/issues)

