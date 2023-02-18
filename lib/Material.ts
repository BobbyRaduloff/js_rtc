import Ray from "@/lib/Ray";
import { Hit } from "@/lib/Hittable";
import Vec3, { dot } from "@/lib/Vec3";
import { rand_unit_vector } from "./Math";

export type MaterialResult = {
  should_scatter: boolean;
  attenuation: Vec3;
  scattered: Ray;
};

export interface Material {
  scatter(ray: Ray, hit: Hit): MaterialResult;
}

export class Diffuse implements Material {
  albedo: Vec3;

  constructor(albedo: Vec3) {
    this.albedo = albedo.clone();
  }

  scatter(ray: Ray, hit: Hit): MaterialResult {
    let scatter_direction = hit.normal.clone().add(rand_unit_vector());
    if (scatter_direction.near_zero()) {
      scatter_direction = hit.normal.clone();
    }

    return {
      should_scatter: true,
      attenuation: this.albedo,
      scattered: new Ray(hit.p, scatter_direction),
    };
  }
}

export class Metalic implements Material {
  albedo: Vec3;
  fuzz: number;

  constructor(albedo: Vec3, fuzz: number) {
    this.albedo = albedo.clone();
    this.fuzz = fuzz > 1 ? 1 : fuzz;
  }

  scatter(ray: Ray, hit: Hit): MaterialResult {
    const reflected = ray.direction.clone().reflect(hit.normal);
    if (this.fuzz === 0) {
      return {
        should_scatter: true,
        attenuation: this.albedo,
        scattered: new Ray(hit.p, reflected),
      };
    }
    const scattered = new Ray(
      hit.p,
      reflected.add(rand_unit_vector().mul(this.fuzz))
    );
    return {
      should_scatter: dot(scattered.direction, hit.normal) > 0,
      attenuation: this.albedo,
      scattered,
    };
  }
}
