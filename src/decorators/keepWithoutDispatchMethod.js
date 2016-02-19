export default function keepWithoutDispatchMethod(target, key, descriptor) {
  Object.defineProperty(target, `${key}WithoutDispatch`, descriptor)
  return descriptor
}
