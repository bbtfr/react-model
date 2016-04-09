import _ from 'lodash'

export default function getUpdateConstants(Class) {
  return `${_.toUpper(_.snakeCase(Class.name))}_UPDATE`
}
