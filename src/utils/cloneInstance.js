export default function cloneInstance() {
  let newInstance = new this.constructor()
  for (let property of Object.getOwnPropertyNames(this)) {
    newInstance[property] = this[property]
  }
  return newInstance
}
