// Service Worker 版本號 - 每次更新時請修改這個版本號
const VERSION = 'v1.0.2';
const CACHE_NAME = `fukuoka-trip-${VERSION}`;

// 需要緩存的文件
const urlsToCache = [
  './index.html',
  './trip.json',
  './manifest.json'
];

// 安裝 Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...', VERSION);
  
  // 立即激活新的 Service Worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...', VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 刪除舊版本的緩存
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即接管所有頁面
      return self.clients.claim();
    })
  );
});

// 攔截網絡請求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // 網絡優先策略：先嘗試從網絡獲取最新內容
    fetch(event.request)
      .then((response) => {
        // 如果成功獲取，更新緩存並返回響應
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 如果網絡請求失敗，從緩存中獲取
        return caches.match(event.request).then((response) => {
          if (response) {
            console.log('[SW] Serving from cache:', event.request.url);
            return response;
          }
          // 如果緩存中也沒有，返回離線頁面
          return new Response('離線狀態，請檢查網絡連接', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// 監聽來自頁面的消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
