// Mock for three.js
export const Vector3 = class {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
};

export const Euler = class {
  constructor(x = 0, y = 0, z = 0, order = 'XYZ') {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }
};

export const Object3D = class {
  constructor() {
    this.position = new Vector3();
    this.rotation = new Euler();
    this.scale = new Vector3(1, 1, 1);
    this.children = [];
  }
  
  traverse(callback) {
    callback(this);
    this.children.forEach(child => child.traverse(callback));
  }
  
  clone() {
    return new Object3D();
  }
};

export const Scene = class extends Object3D {
  constructor() {
    super();
    this.type = 'Scene';
  }
};

export const Group = class extends Object3D {
  constructor() {
    super();
    this.type = 'Group';
  }
};

export const Mesh = class extends Object3D {
  constructor(geometry, material) {
    super();
    this.type = 'Mesh';
    this.geometry = geometry;
    this.material = material;
  }
};

export const Material = class {
  constructor() {
    this.type = 'Material';
  }
};

export const MeshStandardMaterial = class extends Material {
  constructor(parameters = {}) {
    super();
    this.type = 'MeshStandardMaterial';
    Object.assign(this, parameters);
  }
};

export const BufferGeometry = class {
  constructor() {
    this.type = 'BufferGeometry';
  }
};

export const BoxGeometry = class extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1) {
    super();
    this.type = 'BoxGeometry';
    this.parameters = { width, height, depth };
  }
};

export const LoadingManager = class {
  constructor() {
    this.onLoad = null;
    this.onProgress = null;
    this.onError = null;
  }
};

// Export as default object as well
const THREE = {
  Vector3,
  Euler,
  Object3D,
  Scene,
  Group,
  Mesh,
  Material,
  MeshStandardMaterial,
  BufferGeometry,
  BoxGeometry,
  LoadingManager
};

export default THREE;