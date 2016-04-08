import getUpdateConstant from '../utils/getUpdateConstant'

export function updateMethodDecorator(updateMethod, key) {
  return function() {
    if (this.dispatch) {
      const UPDATE = getUpdateConstant(this.constructor)

      let data = this.clone()
      const result = updateMethod.apply(data, arguments)
      this.dispatch({ type: UPDATE, data })
      return result
    } else {
      return updateMethod.apply(this, arguments)
    }
  }
}

export default function updateAction(target, key, descriptor) {
  descriptor.value = updateMethodDecorator(descriptor.value, key)
  return descriptor
}
