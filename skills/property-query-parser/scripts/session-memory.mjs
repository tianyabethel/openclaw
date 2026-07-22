const sessions = new Map();

export function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      city: "",
      maxPrice: null,
      beds: null,
      baths: null,
      type: "",
      pool: "",
      lastResults: [],
      conversationStep: 0,
    });
  }

  return sessions.get(userId);
}

export function updateSession(userId, updates) {
  const session = getSession(userId);

  sessions.set(userId, {
    ...session,
    ...updates,
  });

  return sessions.get(userId);
}

export function clearSession(userId) {
  sessions.delete(userId);
}
