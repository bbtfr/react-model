import toUpper from 'lodash/toUpper'
import snakeCase from 'lodash/snakeCase'

export default function getUpdateConstants(Class) {
  return `${toUpper(snakeCase(Class.name))}_UPDATE`
}
