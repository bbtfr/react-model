import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import Model from './Model'
import ajaxAction from './decorators/ajaxAction'
import keepWithoutDispatchMethod from './decorators/keepWithoutDispatchMethod'
import updateAction, { updateMethodDecorator } from './decorators/updateAction'
import { cloneInstance, cloneInstanceFrom } from './utils/cloneInstance'

export default class Collection {

  constructor(models = []) {
    this.model = Model
    this.url = this.model.urlRoot

    if (models instanceof Collection) {
      this.cloneFrom(models)
    } else {
      this.resetWithoutDispatch(models)
    }
  }

  new(model) {
    model = model instanceof this.model ? model : new this.model(model)
    if (!model.cid) model.cid = _.uniqueId('c')
    model.rid = this.rid
    model.dispatch = this.dispatch
    return model
  }

  @updateAction
  create(model) {
    model = this.new(model)
    this.models.push(model)
    model.sync()
  }

  modelId(model) {
    return model instanceof this.model ? model.id :
      model[this.model.prototype.idAttribute]
  }

  @updateAction
  @keepWithoutDispatchMethod
  sort() {
    this.resetWithoutDispatch(this.sortBy(this.comparator))
  }

  @updateAction
  add(...models) {
    this.resetWithoutDispatch(_.concat(this.models, ...models))
    this.sortWithoutDispatch()
  }

  has(id) {
    return !!this.get(id)
  }

  get(id) {
    return this.find({ id: id }) || this.find({ cid: id })
  }

  getIndex(id) {
    let index = this.findIndex({ id: id })
    if (index < 0) index = this.findIndex({ cid: id })
    return index
  }

  @updateAction
  @keepWithoutDispatchMethod
  set(id, model) {
    const index = this.getIndex(id)
    if (index >= 0) {
      this.models[index] = this.new(model)
    }
  }

  @updateAction
  @keepWithoutDispatchMethod
  remove(id) {
    const index = this.getIndex(id)
    if (index >= 0) this.models.splice(index, 1)
  }

  @updateAction
  @keepWithoutDispatchMethod
  reset(models) {
    this.models = _.map(models, model => this.new(model))
  }

  @ajaxAction
  fetch() {
    return fetch(this.url)
      .then(this.parse)
  }

  sync() {
    this.forEach(model => model.sync())
  }

  parse(response) {
    return response.json()
  }

  toJSON() {
    return this.map(model => model.toJSON());
  }
}

_.forEach([
  "forEach", "each", "map", "collect", "reduce", "foldl", "inject",
  "reduceRight", "foldr", "find", "detect", "filter", "select", "reject",
  "every", "all", "some", "any", "contains", "includes", "invoke", "max", "min",
  "sortBy", "groupBy", "shuffle", "toArray", "size", "first", "head", "take",
  "initial", "rest", "tail", "drop", "last", "without", "indexOf",
  "lastIndexOf", "isEmpty", "chain", "difference", "sample", "partition",
  "countBy", "indexBy", "at", "slice", "findIndex"
], function(name) {
  Collection.prototype[name] = function() {
    return _[name](this.models, ...arguments)
  }
})

_.forEach([
  "concat", "splice", "push", "pop", "unshift", "shift"
], function(name) {
  Collection.prototype[name] = updateMethodDecorator(function() {
    const models = this.models.slice()
    models[name](...arguments)
    return this.resetWithoutDispatch(models)
  })
})

Collection.prototype.isCollection = true
Collection.prototype.clone = cloneInstance
Collection.prototype.cloneFrom = cloneInstanceFrom
Collection.prototype.pluck = Collection.prototype.map
Collection.prototype.where = Collection.prototype.filter
Collection.prototype.findWhere = Collection.prototype.find
