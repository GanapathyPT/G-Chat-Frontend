// worker file name
const workerFile = "worker.js";

enum Mode {
	SUCCESS = 0,
	FAILURE = 1,
}

const log = (data: string, mode: Mode) =>
	process.env.NODE_ENV === "development" &&
	console.log(
		`%cService_Worker: %c${data}`,
		"font-weight: bold",
		`color: ${mode === Mode.SUCCESS ? "#0f0" : "#f00"}`
	);

export function register() {
	// don't do anything for development environment
	// comment below code for testing service worker locally
	if (process.env.NODE_ENV === "development") return;

	// check if the service worker is available in thee browser
	if (navigator.serviceWorker) {
		window.addEventListener("load", async () => {
			try {
				// register a service worker with the file mentioned above
				await navigator.serviceWorker.register(workerFile);
				log("Registered", Mode.SUCCESS);
			} catch {
				log("Registration_Error", Mode.FAILURE);
			}
		});
	}
}
