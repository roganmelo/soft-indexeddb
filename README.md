# soft-indexeddb
Minimalist indexeddb abstraction 💾

[![NPM version](https://badge.fury.io/js/soft-indexeddb.png)](http://badge.fury.io/js/soft-indexeddb)

[![Npm Downloads](https://nodei.co/npm/soft-indexeddb.png?downloads=true&stars=true)](https://nodei.co/npm/soft-indexeddb.png?downloads=true&stars=true)

## Installation

```
npm install --save soft-indexeddb
```
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