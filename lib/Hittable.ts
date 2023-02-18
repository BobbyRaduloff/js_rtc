import Ray from "@/lib/Ray";
import Vec3 from "@/lib/Vec3";
import { Material } from "@/lib/Material";

export type MissedHit = {
  is_hit: boolean;
};

export type Hit = {
  is_hit: boolean;
  t: number;
  p: Vec3;
  normal: Vec3;
  front_face: boolean;
  hittable: Hittable;
  material: Material;
};

export function is_valid_hit(hit: Hit | MissedHit): hit is Hit {
  if (!hit.is_hit) {
    return false;
  }

  if (
    !(
      "t" in hit &&
      "p" in hit &&
      "normal" in hit &&
      "front_face" in hit &&
      "material" in hit
    )
  ) {
    return false;
  }

  return true;
}

interface Hittable {
  hits(ray: Ray): Hit | MissedHit;
  get_unit_color_on_hit(hit: Hit): Vec3;
  clone_hittable(): Hittable;
}

export default Hittable;
