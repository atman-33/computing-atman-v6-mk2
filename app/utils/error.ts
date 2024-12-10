export const notImplemented = (message = 'Not implemented'): never => {
  throw new Error(message);
};
