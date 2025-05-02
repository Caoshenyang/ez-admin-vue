type MessageType = 'success' | 'info' | 'warning' | 'error';

const createMessage = (type: MessageType) => (msg: string) => {
  ElMessage({ message: msg, type });
};

export const msgSuccess = createMessage('success');
export const msgInfo = createMessage('info');
export const msgWarning = createMessage('warning');
export const msgErr = createMessage('error');
