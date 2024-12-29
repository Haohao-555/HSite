import authBtn from './authBtn'
import highlight from './highlight'
export default app => {
  app.directive('auth', authBtn)
  app.directive('highlight', highlight)
}
