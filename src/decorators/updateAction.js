import getUpdateConstant from '../utils/getUpdateConstant'

export function updateMethodDecorator(updateMethod) {
  return function() {
    if (this.dispatch) {
      const UPDATE = getUpdateConstant(this.constructor)

      let next = this.clone()
      const result = updateMethod.apply(next, arguments)
      this.dispatch({ type: UPDATE, prev: this, next })
      return result
    } else {
      return updateMethod.apply(this, arguments)
    }
  }
}

export default function updateAction(target, key, descriptor) {
  descriptor.value = updateMethodDecorator(descriptor.value)
  return descriptor
}
