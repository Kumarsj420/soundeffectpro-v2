export { };

declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
    }
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

