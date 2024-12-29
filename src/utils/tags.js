const whiteList = ['login', 'notesdetail']
export function isTags(path) {
  return !whiteList.includes(path)
}
