Pie Chart example:

```js
function randomNumber() {
    return Math.random() * (40 - 0) + 0;
}

const data = [
    { label: 'Group 1', value: randomNumber() },
    { label: 'Group 2', value: randomNumber() },
    { label: 'Group 3', value: randomNumber() },
];

<PieChart data={data} />
```