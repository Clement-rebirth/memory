import './firebase';
import { getDatabase, ref, onValue, get, set, update, remove, push } from 'firebase/database';

export default class Manager {

  /**
   * @param {string} refPath path representing the location the returned Reference will point
   */
  constructor(refPath = false) {
    if (!refPath) throw new Error('refPath parameter must be defined');
    if (typeof refPath !== 'string') throw new Error('refPath parameter must be a string');
    
    const db = getDatabase();
    this.ref = ref(db, refPath);
  }

  /**
   * @param {function} onData callback function to execute on 'value' event.
   * The function will be passed a DataSnapshot
   * @param {function} onError An optional callback that will be notified if your client does not have permission to read the data. 
   * This callback will be passed an Error object indicating why the failure occurred.
   */
  getAll(onData, onError = null) {
    if (!onError) onError = (error => console.error(error.message));
    return onValue(this.ref, onData, onError);
  }

  /**
   * @param {function} onData callback function to execute on 'value' event.
   * The function will be passed a DataSnapshot
   * @param {function} onError An optional callback that will be notified if your client does not have permission to read the data. 
   * This callback will be passed an Error object indicating why the failure occurred.
   */
  getAllOnce(onData, onError = null) {
    if (!onError) onError = (error => console.error(error.message));
    get(this.ref).then(onData).catch(onError);
  }

  /**
   * add data to a collection of items
   * @param {any} value 
   */
  add(value) {
    return push(this.ref, value);
  }

  /**
   * push a collection of data
   * @param {object} values 
   * @param {function} onComplete 
   */
  multipleAdd(values, onComplete = () => {}) {
    let updates = {};

    values.forEach(item => {
      let itemKey = push(this.ref).key
      updates['/' + itemKey] = item;
    });

    this.update(updates, onComplete);
  }

  /**
   * @param {any} value 
   * @param {function} onComplete Callback called when write to server is complete.
   */
  set(value, onComplete = () => {}) {
    const onError = error => console.error(error);

    set(this.ref, value)
      .then(onComplete)
      .catch(onError);
  }
  
  /**
   * @param {object} values The values argument contains multiple property-value pairs that will be written to the Database together. 
   * Each child property can either be a simple property (for example, "name") or a relative path (for example, "name/first") 
   * from the current location to the data to update.
   * @return Resolves when update on server is complete.
   */
  update(values) {
    return update(this.ref, values);
  }

  /**
   * @param {function} onComplete 
   * @return Resolves when remove on server is complete.
   */
  delete(onComplete = () => {}) {
    const onError = error => console.error(error);

    remove(this.ref)
      .then(onComplete)
      .catch(onError);
  }
}
