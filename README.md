# soft-indexeddb
Minimalist indexeddb abstraction 💾

## Usage

```js
const idb = new IDB({
  name: 'db',
  version: 5,
  stores: [
    {
      name: 'store1',
      autoIncrement: true
    },
    {
      name: 'store2',
      autoIncrement: true
    }
  ]
});

idb.store('store1').find()
  .then(res => {
    // ...
  })
  .catch(err => {
    // ...
  })
```