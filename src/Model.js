import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import ajaxAction from './decorators/ajaxAction'
import keepWithoutDispatchMethod from './decorators/keepWithoutDispatchMethod'
import updateAction, { updateMethodDecorator } from './decorators/updateAction'
import { cloneInstance, cloneInstanceFrom } from './utils/cloneInstance'

export default class Model {

  constructor(attributes = {}) {
    this.reset(attributes)
  }

  isNew() {
    return !!this.id
  }

  @updateAction
  @keepWithoutDispatchMethod
  reset(attributes) {
    this.attributes = attributes
    this.id = attributes[this.idAttribute]
  }

  url() {
    const urlRoot = _.result(this.urlRoot)
    return this.id ? `${urlRoot}/${this.id}` : urlRoot
  }

  @ajaxAction
  sync() {
    const method = this.isNew() ? 'post' : 'put'
    const url = _.result(this.url)
    return fetch(this.url, { method: method }).then(this.parse)
  }

  parse(response) {
    return response.json()
  }

  toJSON() {
    return _.clone(this.attributes);
  }
}

_.forEach([
  "keys", "values", "pairs", "invert", "pick", "omit", "chain", "isEmpty",
  "get", "has"
], function(name) {
  Model.prototype[name] = function() {
    return _[name](this.attributes, ...arguments)
  }
})

_.forEach([
  "set", "unset"
], function(name) {
  Model.prototype[name] = updateMethodDecorator(function() {
    const attributes = _.clone(this.attributes)
    _[name](attributes, ...arguments)
    return this.resetWithoutDispatch(attributes)
  })
})

Model.prototype.clone = cloneInstance
Model.prototype.cloneFrom = cloneInstanceFrom
Model.prototype.clear = _.partial(Model.prototype.reset, {})
Model.prototype.idAttribute = "id"
