import { createStore } from 'vuex'
import user from './modules/users'
import app from './modules/app'
import theme from './modules/theme'
import notes from './modules/notes'
import getters from './getters'
export default createStore({
  getters,
  modules: {
    user,
    app,
    theme,
    notes
  }
})
