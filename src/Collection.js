import Imm from 'immutable'
import fetch from 'isomorphic-fetch'

import Model from './Model'
import ajaxAction from './decorators/ajaxAction'
import keepWithoutDispatchMethod from './decorators/keepWithoutDispatchMethod'
import updateAction, { updateMethodDecorator } from './decorators/updateAction'
import { cloneInstance, cloneInstanceFrom } from './utils/cloneInstance'
import UniqueID from './utils/UniqueID'

export default class Collection {

  constructor(models = []) {
    this.model = Model
    this.url = this.model.urlRoot
    this.resetWithoutDispatch(models)
  }

  __dispatch() {
    console.error("You have to call `bindDispatch` first!")
  }

  @updateAction
  @keepWithoutDispatchMethod
  reset(models) {
    if (models instanceof Collection) {
      this.cloneFrom(models)
    } else {
      this.models = Imm.List(models).map(::this.new)
    }
  }

  new(model) {
    model = model instanceof this.model ? model : new this.model(model)
    if (!model.__ownerID) model.__ownerID = new UniqueID()
    model.__reducerID = this.__reducerID
    model.dispatch = this.dispatch
    return model
  }

  @ajaxAction
  fetch() {
    return fetch(this.url).then(this.parse)
  }

  parse(response) {
    return response.json()
  }
}

Collection.prototype.clone = cloneInstance
Collection.prototype.cloneFrom = cloneInstanceFrom
