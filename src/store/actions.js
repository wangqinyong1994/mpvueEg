import * as types from './mutation-types'

export const changeCount = function ({commit, state}, count) {
  commit(types.SET_COUNT, state.count + count)
}
