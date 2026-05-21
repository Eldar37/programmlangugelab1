export function createClientId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isRemotePostId(id) {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId >= 1 && numericId <= 100;
}

export function normalizePost(post) {
  return {
    id: post.id,
    userId: Number(post.userId) || 1,
    title: String(post.title || '').trim(),
    body: String(post.body || '').trim(),
    createdAt: post.createdAt || null,
    updatedAt: post.updatedAt || null,
    isLocal: Boolean(post.isLocal),
  };
}

export function getPostExcerpt(body, maxLength = 150) {
  if (!body || body.length <= maxLength) {
    return body;
  }

  return `${body.slice(0, maxLength).trim()}...`;
}

export function getUserName(users, userId) {
  const user = users.find((item) => Number(item.id) === Number(userId));
  return user ? user.name : `Автор #${userId}`;
}

export function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
