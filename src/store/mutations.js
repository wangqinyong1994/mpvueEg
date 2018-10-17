import * as types from './mutation-types'

const mutations = {
  [types.SET_OPEN_ID] (state, openId) {
    state.openId = openId
  },
  [types.SET_COUNT] (state, count) {
    state.count = count
  }
}

export default mutations
