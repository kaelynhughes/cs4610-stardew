function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function hello(name) {
  sleep(3000).then(() => {
    return `Hello, ${name}`;
  });
}

self.addEventListener("message", (event) => {
  self.postMessage("hello!");
});
