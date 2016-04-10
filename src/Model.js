import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import ajaxAction from './decorators/ajaxAction'
import keepWithoutDispatchMethod from './decorators/keepWithoutDispatchMethod'
import updateAction, { updateMethodDecorator } from './decorators/updateAction'
import { cloneInstance, cloneInstanceFrom } from './utils/cloneInstance'

export default class Model {

  constructor(attributes = {}) {
    this.reset(attributes)
    this.resetPreviousAttributes()
  }

  isNew() {
    return !this.id
  }

  isValid() {
    return this.validate ? this.validationError = this.validate() : true
  }

  @updateAction
  @keepWithoutDispatchMethod
  reset(attributes) {
    this.attributes = _.assign({}, this.constructor.defaults, attributes)
    this.id = attributes[this.constructor.idAttribute]
    this.changed = true
  }

  resetPreviousAttributes() {
    this.previousAttributes = _.clone(this.attributes)
    this.changed = false
  }

  previous(key) {
    return _.get(this.previousAttributes, key)
  }

  hasChanged(key) {
    return !_.isEqual(this.previous(key), this.get(key))
  }

  changedAttributes() {
    return this.keys().filter(key => this.hasChanged(key))
  }

  url() {
    const { id } = this
    const { urlRoot } = this.constructor
    return urlRoot && (id ? `${urlRoot}/${id}` : urlRoot)
  }

  @ajaxAction
  fetch() {
    this.resetPreviousAttributes()
    return fetch(this.url())
      .then(this.parse)
  }

  @ajaxAction
  sync() {
    this.resetPreviousAttributes()
    const method = this.isNew() ? 'post' : 'put'
    return fetch(this.url(), { method: method })
      .then(this.parse)
  }

  @ajaxAction
  destroy() {
    this.resetPreviousAttributes()
    return fetch(this.url(), { method: 'delete' })
      .then(this.parse)
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

Model.idAttribute = "id"
Model.defaults = {}
Model.prototype.isModel = true
Model.prototype.clone = cloneInstance
Model.prototype.cloneFrom = cloneInstanceFrom
Model.prototype.clear = _.partial(Model.prototype.reset, {})
Model.prototype.save = Model.prototype.sync
