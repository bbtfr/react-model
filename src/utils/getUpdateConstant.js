import toUpper from 'lodash/toUpper'

export default function getUpdateConstants(Class) {
  return `${toUpper(Class.name)}_UPDATE`
}
