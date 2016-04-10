import './index.html'
import './labels.json'

// Create your own Model and Collection
import { Model, Collection } from 'react-model'

class Label extends Model {
  static urlRoot = "labels.json"
  static defaults = {
    title: "untitled",
    style: "default"
  }
}

class Labels extends Collection {
  static Model = Label
}


// Create your own React Component
import React, { Component } from 'react'
import CSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'

@connect(state => ({ labels: state.labels }))
class Main extends Component {
  componentDidMount() {
    // This will dispatch an action
    this.props.labels.fetch()
  }

  renderLabel(label) {
    return (
      <span
        key={label.cid}
        className={`label label-${label.get('style')}`}
        >
        {label.get('title')}
      </span>
    )
  }

  render() {
    const labels = window.labels = this.props.labels
    return (
      <CSSTransitionGroup
        transitionName="label"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
        >
        {labels.map(this.renderLabel)}
      </CSSTransitionGroup>
    )
  }
}


// Create a Redux reducer with ReactModel.createReducer
import { combineReducers } from 'redux'
import { createReducer } from 'react-model'

const rootReducer = combineReducers({
  labels: createReducer(Labels)
})


// Create a Redux store holding the state of your app.
// Then join them together!
// import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'

const loggerMiddleware = createLogger()
const createStoreWithMiddleware = applyMiddleware(
  loggerMiddleware
)(createStore)
const store = createStoreWithMiddleware(rootReducer)

// Bind dispatch to ReactModel
import { bindDispatch } from 'react-model'

bindDispatch(store.dispatch)

// Render
import { render } from 'react-dom'
import { Provider } from 'react-redux'

render((
  <Provider store={store}>
    <Main/>
  </Provider>
), document.getElementById('app'))
