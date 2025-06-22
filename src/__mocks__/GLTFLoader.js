// Mock for GLTFLoader
export class GLTFLoader {
  constructor() {}
  
  load(url, onLoad, onProgress, onError) {
    // Mock successful load
    setTimeout(() => {
      if (onLoad) {
        onLoad({
          scene: {
            children: [],
            traverse: () => {},
            clone: () => ({ children: [] })
          },
          animations: [],
          cameras: [],
          asset: {}
        });
      }
    }, 0);
  }
  
  loadAsync(url) {
    return Promise.resolve({
      scene: {
        children: [],
        traverse: () => {},
        clone: () => ({ children: [] })
      },
      animations: [],
      cameras: [],
      asset: {}
    });
  }
}