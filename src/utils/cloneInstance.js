export function cloneInstance() {
  let newInstance = new this.constructor()
  for (let property of Object.getOwnPropertyNames(this)) {
    newInstance[property] = this[property]
  }
  return newInstance
}

export function cloneInstanceFrom(source) {
  for (let property of Object.getOwnPropertyNames(source)) {
    this[property] = source[property]
  }
}
