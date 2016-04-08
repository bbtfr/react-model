export function cloneInstance() {
  let clone = new this.constructor()
  for (let property of Object.getOwnPropertyNames(this)) {
    clone[property] = this[property]
  }
  if (clone.models) clone.models = clone.models.slice()
  return clone
}

export function cloneInstanceFrom(source) {
  for (let property of Object.getOwnPropertyNames(source)) {
    this[property] = source[property]
  }
  if (this.models) this.models = this.models.slice()
}
