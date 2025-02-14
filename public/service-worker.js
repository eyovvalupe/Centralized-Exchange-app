const CACHE_NAME = 'cache-v1';

// 预缓存清单（由 Workbox 自动注入）
const manifest = self.__WB_MANIFEST;

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 将预缓存清单中的资源添加到缓存
      return cache.addAll(['/']);
    })
  );

  // 跳过等待，立即激活新 Service Worker
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // 删除旧缓存
          }
        })
      );
    })
  );

  // 立即控制页面
  self.clients.claim();
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // 从缓存中返回
      }
      return fetch(event.request); // 从网络获取
    })
  );
});