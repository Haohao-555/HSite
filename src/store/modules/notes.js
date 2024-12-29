import { getTitle } from '@/api/home'
export default {
  namespaced: true,
  state: () => ({
    titleList: []
  }),
  mutations: {
    setTitleList(state, data) {
      state.titleList = data
    }
  },
  actions: {
    async requestTitleList({ commit }) {
      const res = await getTitle()
      if (res.errorno === 0) {
        commit('setTitleList', res.data.rows)
      }
    }
  }
}
