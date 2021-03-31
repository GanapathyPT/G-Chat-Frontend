// cache file name
const cacheName = "v1";
const cachingURLS = ["/"];

const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";
const log = (data, mode) =>
	process.env.NODE_ENV === "development" &&
	console.log(
		`%cServiceWorker: %c${data}`,
		"font-weight: bold",
		`color: ${mode === SUCCESS ? "#0f0" : "#f00"}`
	);

self.addEventListener("install", (event) => {
	log("Installed", SUCCESS);

	event.waitUntil(
		caches.open(cacheName).then((cache) => {
			// caching all the urlsmentioned above
			log("CachingURLS", SUCCESS);
			cache.addAll(cachingURLS);
		})
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((name) => {
					if (name === cacheName) {
						return caches.delete(name);
					}
				})
			);
		})
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		fetch(event.request)
			.then((response) => {
				/*
				if (response.status === 200) {
					caches.open(cacheName).then((cache) => {
						// cloning the whole response and caching
						log("CachingResponse", SUCCESS);
						const responseClone = response.clone();
						cache.put(event.request, responseClone);
					});
				}*/
				return response;
			})
			.catch(() => caches.match(event.request).then((res) => res))
	);
});
