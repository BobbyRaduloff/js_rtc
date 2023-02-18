export default class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get(index: number): number {
    if (index < 0 || index > 2) {
      throw new RangeError(
        `invalid vector index access, 3 dimensions available, caller asked for ${index}-th`
      );
    }

    if (index === 0) {
      return this.x;
    } else if (index === 1) {
      return this.y;
    } else if (index === 2) {
      return this.z;
    }

    return Number.MIN_VALUE;
  }

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  neg(): Vec3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
  }

  add(v: Vec3): Vec3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  sub(v: Vec3): Vec3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  mul(a: number): Vec3 {
    this.x *= a;
    this.y *= a;
    this.z *= a;

    return this;
  }

  mul_vec(v: Vec3): Vec3 {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;
  }

  div(a: number): Vec3 {
    if (a === 0) {
      throw new RangeError("can't divide vector by 0");
    }

    this.x /= a;
    this.y /= a;
    this.z /= a;

    return this;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  unitize(): Vec3 {
    return this.div(this.length());
  }

  near_zero(): boolean {
    const s = 1e-8;
    return Math.abs(this.x) < s && Math.abs(this.y) < s && Math.abs(this.z) < s;
  }

  reflect(n: Vec3): Vec3 {
    return this.clone().sub(n.clone().mul(2 * dot(this, n)));
  }
}

export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return new Vec3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}
