import Vec3, { dot } from "@/lib/Vec3";

export function lerp(t: number, start_value = 0, end_value = 1) {
  if (t < start_value || t > end_value) {
    throw new RangeError(`cannot lerp ${t} in [${start_value}, ${end_value}]`);
  }

  return (1 - t) * start_value + t * end_value;
}

export function lerp_vec3(
  t: number,
  start_value: Vec3 = new Vec3(0, 0, 0),
  end_value: Vec3 = new Vec3(1, 1, 1)
): Vec3 {
  return start_value
    .clone()
    .mul(1 - t)
    .add(end_value.clone().mul(t));
}

export function unit_color_to_255(color: Vec3): Vec3 {
  return color.clone().mul(255);
}

export function deg_to_rad(deg: number): number {
  return (deg / 180) * Math.PI;
}

export function rand(min = 0, max = 1): number {
  if (min === 0 && max === 1) {
    return Math.random();
  }

  return Math.random() * (max - min) + min;
}

export function clamp(x: number, min = 0, max = 1): number {
  if (x < min) {
    return min;
  }

  if (x > max) {
    return max;
  }

  return x;
}

export function multisample_unit_color_to_single_255(
  color: Vec3,
  samples: number
): Vec3 {
  let r = color.x;
  let g = color.y;
  let b = color.z;

  const scale = 1 / samples;
  r = Math.sqrt(scale * r);
  g = Math.sqrt(scale * g);
  b = Math.sqrt(scale * b);

  return new Vec3(
    Math.round(256 * clamp(r, 0, 0.999)),
    Math.round(256 * clamp(g, 0, 0.999)),
    Math.round(256 * clamp(b, 0, 0.999))
  );
}

export function rand_vec3(min = 0, max = 1): Vec3 {
  return new Vec3(rand(min, max), rand(min, max), rand(min, max));
}

export function rand_in_unit_sphere(): Vec3 {
  let p = rand_vec3(-1, 1);
  while (p.length() * p.length() <= 1) {
    p = rand_vec3(-1, 1);
  }

  return p;
}

export function rand_unit_vector() {
  return rand_in_unit_sphere().unitize();
}

export function rand_in_hemisphere(normal: Vec3): Vec3 {
  const in_unit_sphere = rand_in_unit_sphere();
  if (dot(in_unit_sphere, normal) > 0) {
    return in_unit_sphere;
  }

  return in_unit_sphere.mul(-1);
}
