import Vec3 from "@/lib/Vec3";

export default class Ray {
  origin: Vec3;
  direction: Vec3;

  constructor(origin: Vec3 | null = null, direction: Vec3 | null = null) {
    this.origin = origin ? origin.clone() : new Vec3();
    this.direction = direction ? direction.clone() : new Vec3();
  }

  at(t: number): Vec3 {
    return this.origin.clone().add(this.direction.clone().mul(t));
  }

  clone(): Ray {
    return new Ray(this.origin, this.direction);
  }
}
