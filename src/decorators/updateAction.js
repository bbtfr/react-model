import getUpdateConstant from '../utils/getUpdateConstant'

export function updateMethodDecorator(updateMethod) {
  return function() {
    const UPDATE = getUpdateConstant(this.constructor)

    let data = this.clone()
    let result = updateMethod.apply(data, arguments)
    this.__dispatch({ type: UPDATE, data })
    return result
  }
}

export default function updateAction(target, key, descriptor) {
  descriptor.value = updateMethodDecorator(descriptor.value)
  return descriptor
}
