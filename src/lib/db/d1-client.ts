interface D1WorkerResponse<T> {
  success?: boolean;
  meta?: Record<string, unknown>;
  results?: T[];
  error?: string;
}

/**
 * Queries Cloudflare D1 via the custom REST Worker Proxy.
 */
async function queryD1<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  // Configured to use the deployed Worker URL by default
  const url = process.env.CLOUDFLARE_D1_WORKER_URL || 'https://d1-rest.nilxnjxnbusiness.workers.dev/query';
  const token = process.env.CLOUDFLARE_D1_WORKER_SECRET || '';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: sql,
      params,
    }),
  });

  const data = await response.json() as D1WorkerResponse<T>;

  if (!response.ok || data.error) {
    console.error('D1 Worker Error:', data.error);
    throw new Error(`Cloudflare D1 Worker Error: ${data.error || response.statusText}`);
  }

  // D1 DB.prepare().all() in the worker returns { success, meta, results }
  return data.results || [];
}

export interface User {
  id: string;
  email: string;
  tracking_code: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'paid';
  payment_reference: string | null;
  track_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  item_type: 'song' | 'album';
  artist: string;
  cover_url: string;
  preview_url: string | null;
  r2_download_key: string;
  price: string;
  season: 'FRESH' | 'AKAD' | 'LATE' | null;
  slug: string;
  created_at: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await queryD1<User>('SELECT * FROM users WHERE email = ?', [email]);
  return users[0] ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await queryD1<User>('SELECT * FROM users WHERE id = ?', [id]);
  return users[0] ?? null;
}

export async function createUser(id: string, email: string, trackingCode: string): Promise<User> {
  await queryD1('INSERT INTO users (id, email, tracking_code) VALUES (?, ?, ?)', [id, email, trackingCode]);
  return { id, email, tracking_code: trackingCode, created_at: new Date().toISOString() };
}

export async function createOrder(orderId: string, userId: string, amount: number, trackId: string | null = null): Promise<void> {
  await queryD1('INSERT INTO orders (id, user_id, amount, status, track_id) VALUES (?, ?, ?, ?, ?)', [
    orderId, userId, amount, 'pending', trackId
  ]);
}

export async function updateOrderStatus(orderId: string, status: string, paymentReference: string): Promise<void> {
  await queryD1('UPDATE orders SET status = ?, payment_reference = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
    status, paymentReference, orderId
  ]);
}

export async function logAudit(actorId: string | null, action: string, entityType: string, entityId: string, metadata: Record<string, unknown>): Promise<void> {
  await queryD1('INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?)', [
    actorId, action, entityType, entityId, JSON.stringify(metadata)
  ]);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const orders = await queryD1<Order>('SELECT * FROM orders WHERE id = ?', [orderId]);
  return orders[0] ?? null;
}

export async function getPaidOrderByEmailAndTracking(email: string, trackingCode: string): Promise<Order | null> {
  const query = `
    SELECT orders.* 
    FROM orders 
    JOIN users ON orders.user_id = users.id 
    WHERE users.email = ? AND users.tracking_code = ? AND orders.status = 'paid'
    ORDER BY orders.created_at DESC LIMIT 1
  `;
  const orders = await queryD1<Order>(query, [email, trackingCode]);
  return orders[0] ?? null;
}

export async function getCatalogItems(): Promise<CatalogItem[]> {
  return await queryD1<CatalogItem>('SELECT * FROM catalogs ORDER BY created_at DESC');
}

export async function getCatalogItemById(id: string): Promise<CatalogItem | null> {
  const items = await queryD1<CatalogItem>('SELECT * FROM catalogs WHERE id = ?', [id]);
  return items[0] ?? null;
}

export async function createCatalogItem(item: Omit<CatalogItem, 'created_at'>): Promise<void> {
  await queryD1(
    `INSERT INTO catalogs (id, title, item_type, artist, cover_url, preview_url, r2_download_key, price, season, slug) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [item.id, item.title, item.item_type, item.artist, item.cover_url, item.preview_url, item.r2_download_key, item.price, item.season, item.slug]
  );
}

export async function deleteCatalogItem(id: string): Promise<void> {
  await queryD1('DELETE FROM catalogs WHERE id = ?', [id]);
}
