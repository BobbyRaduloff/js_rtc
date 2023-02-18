import Vec3, { dot } from "@/lib/Vec3";
import Hittable, { Hit, is_valid_hit, MissedHit } from "@/lib/Hittable";
import { Material } from "@/lib/Material";
import Ray from "@/lib/Ray";

export default class Sphere implements Hittable {
  center: Vec3;
  radius: number;
  material: Material;

  constructor(center: Vec3, radius: number, material: Material) {
    this.center = center.clone();
    this.radius = radius;
    this.material = material;
  }

  clone(): Sphere {
    return new Sphere(this.center, this.radius, this.material);
  }

  clone_hittable(): Hittable {
    return this.clone();
  }

  hits(ray: Ray, min_t = 0.001, max_t = Infinity): Hit | MissedHit {
    const oc = ray.origin.clone().sub(this.center);
    const a = ray.direction.length() * ray.direction.length();
    const half_b = dot(oc, ray.direction);
    const c = oc.length() * oc.length() - this.radius * this.radius;
    const discriminant = half_b * half_b - a * c;

    if (discriminant < 0) {
      return { is_hit: false };
    }

    const sqrt_d = Math.sqrt(discriminant);
    let root = (-half_b - sqrt_d) / a;
    if (root < min_t || root > max_t) {
      root = (-half_b + sqrt_d) / a;
      if (root < min_t || root > max_t) {
        return { is_hit: false };
      }
    }

    const p = ray.at(root);
    const outward_normal = p.clone().sub(this.center).div(this.radius);
    const front_face = dot(ray.direction, outward_normal) < 0;
    const normal = front_face ? outward_normal : outward_normal.mul(-1);
    return {
      is_hit: true,
      t: root,
      p,
      normal,
      front_face,
      hittable: this,
      material: this.material,
    };
  }

  get_unit_color_on_hit(hit: Hit): Vec3 {
    if (!is_valid_hit(hit)) {
      throw new Error("attempted to get color value for invalid hit");
    } else {
      return new Vec3(hit.normal.x + 1, hit.normal.y + 1, hit.normal.z + 1).mul(
        0.5
      );
    }
  }
}
