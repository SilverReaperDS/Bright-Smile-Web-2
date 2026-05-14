function getIo(app) {
  return app?.get?.('io') || null;
}

function toThreadRoom(threadId) {
  return `thread:${threadId}`;
}

function toUserRoom(userId) {
  return `user:${userId}`;
}

function emitMessageEvent(app, payload) {
  const io = getIo(app);
  if (!io || !payload?.threadId) return;

  io.to(toThreadRoom(payload.threadId)).emit('message:new', payload);
  if (payload.userId) {
    io.to(toUserRoom(payload.userId)).emit('message:new', payload);
  }
  io.emit('thread:updated', { threadId: payload.threadId, userId: payload.userId || null });
}

module.exports = {
  getIo,
  toThreadRoom,
  toUserRoom,
  emitMessageEvent,
};
