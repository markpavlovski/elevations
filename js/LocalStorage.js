class LocalStorage {

  static set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  static get(key) {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : false
  }

  static clear() {
    window.localStorage.clear()
    console.log("Storage is now empty.")
  }

  static list() {
    Object.keys(window.localStorage).forEach((el) => console.log(el, window.localStorage[el]))
    if (!this.length) console.log("Storage is empty.")
  }

  static get length() {
    return window.localStorage.length
  }
}
