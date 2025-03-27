export const msgSuccess = (msg: string) => {
  ElMessage({
    message: msg,
    type: 'success',
  })
}
export const msgInfo = (msg: string) => {
  ElMessage({
    message: msg,
    type: 'warning',
  })
}
export const msgErr = (msg: string) => {
  ElMessage({
    message: msg,
    type: 'error',
  })
}
