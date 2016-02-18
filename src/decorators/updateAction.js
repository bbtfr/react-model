import getUpdateConstant from '../utils/getUpdateConstant'

export default function updateAction(target, key, descriptor) {
  const updateMethod = descriptor.value

  descriptor.value = function() {
    const UPDATE = getUpdateConstant(this.constructor)

    const result = updateMethod.apply(this, arguments)
    this.dispatch({ type: UPDATE, data: this })
    return result
  }

  return descriptor
}
