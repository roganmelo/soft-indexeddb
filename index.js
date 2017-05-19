window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

const IDB = (function() {
  let connection;

  const createDatabase = config => {
    const request = window.indexedDB.open(config.name, config.version);

    request.onupgradeneeded = event => createStores(event.target.result, config.stores);
    request.onsuccess = event => connection = connection ? connection : event.target.result;
    request.onerror = event => { throw event.target.error };
  }

  const createStores = (connection, stores) => {
    stores.forEach(store => {
      if(connection.objectStoreNames.contains(store.name))
        connection.deleteObjectStore(store.name);

      connection.createObjectStore(store.name, Object.assign(store, { keyPath: 'ssn' }));
    });
  }

  const run = (store, method, data) => {
    return new Promise((resolve, reject) => {
      const request = store[method](data);

      request.onsuccess = event => resolve(event.target.result);
      request.onerror = event => reject(event.target.error);
    });
  }

  return class IDB {
    constructor(config) {
      createDatabase(config);
    }

    close() {
      if(connection) {
        connection.close();
        connection = null;
      }
    }

    store(name) {
      if(!connection)
        throw new Error('Connection is closed.');

      this._store = connection.transaction([name], 'readwrite').objectStore(name);

      return this;
    }

    find() {
      return new Promise((resolve, reject) => {
        const cursor = this._store.openCursor();
        const data = [];

        cursor.onsuccess = event => {
          const actual = event.target.result;

          if(actual) {
            data.push(actual.value);
            actual.continue();
          } else {
            resolve(data);
          }
        };

        cursor.onerror = event => reject(event.target.error);
      });
    }

    get(ssn) {
      return run(this._store, 'get', ssn);
    }

    create(data) {
      if(Array.isArray(data))
        return Promise.all(data.map(item => run(this._store, 'add', item)));
      else
        return run(this._store, 'add', data);
    }

    update(ssn, data) {
      if(Array.isArray(data))
        return Promise.all(data.map(item => run(this._store, 'put', Object.assign(item, { ssn }))));
      else
        return run(this._store, 'put', Object.assign(data, { ssn }));
    }

    remove(ssn) {
      if(Array.isArray(ssn))
        return Promise.all(ssn.map(item => run(this._store, 'delete', item)));
      else
        return run(this._store, 'delete', ssn);
    }

    clear() {
      return run(this._store, 'clear');
    }
  }
})();
