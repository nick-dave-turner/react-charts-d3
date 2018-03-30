Area Chart example:

```js
function randomNumber() {
    return Math.random() * (40 - 0) + 0;
}

const data = [
    { key: 'Group 1', values: [ { x: 'A', y: randomNumber() }, { x: 'B', y: randomNumber() }, { x: 'C', y: randomNumber() }, { x: 'D', y: randomNumber() } ] },
    { key: 'Group 2', values: [ { x: 'A', y: randomNumber() }, { x: 'B', y: randomNumber() }, { x: 'C', y: randomNumber() }, { x: 'D', y: randomNumber() } ] },
    { key: 'Group 3', values: [ { x: 'A', y: randomNumber() }, { x: 'B', y: randomNumber() }, { x: 'C', y: randomNumber() }, { x: 'D', y: randomNumber() } ] },
];

<AreaChart data={data} />
```