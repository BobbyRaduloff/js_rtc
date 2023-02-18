import Camera from "@/lib/Camera";
import Hittable, { Hit, is_valid_hit, MissedHit } from "@/lib/Hittable";
import Vec3 from "@/lib/Vec3";
import {
  lerp_vec3,
  multisample_unit_color_to_single_255,
  unit_color_to_255,
  rand,
} from "@/lib/Math";
import Ray from "@/lib/Ray";
import { MaterialResult } from "@/lib/Material";

export default class Scene {
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  camera: Camera;
  background_gradient: { start: Vec3; end: Vec3 };
  hittable: Hittable[];
  samples_per_pixel: number;
  max_depth: number;

  constructor(
    width: number,
    height: number,
    context: CanvasRenderingContext2D,
    max_depth = 50,
    samples_per_pixel = 100,
    background_gradient: { start: Vec3; end: Vec3 } = {
      start: new Vec3(1, 1, 1),
      end: new Vec3(0.5, 0.7, 1),
    },
    camera: Camera | null = null
  ) {
    this.width = width;
    this.height = height;
    this.context = context;
    this.camera = camera ? camera.clone() : new Camera(this.width, this.height);
    if (background_gradient) {
      this.background_gradient = {
        start: background_gradient.start.clone(),
        end: background_gradient.end.clone(),
      };
    } else {
      this.background_gradient = {
        start: new Vec3(0, 0, 0),
        end: new Vec3(1, 1, 1),
      };
    }
    this.hittable = [];
    this.samples_per_pixel = samples_per_pixel;
    this.max_depth = max_depth;
  }

  clone(): Scene {
    const scene = new Scene(
      this.width,
      this.height,
      this.context,
      this.max_depth,
      this.samples_per_pixel,
      this.background_gradient,
      this.camera
    );
    scene.hittable = this.hittable.map((h) => h.clone_hittable());
    return scene;
  }

  add(hittable: Hittable): void {
    this.hittable.push(hittable);
  }

  add_clone(hittable: Hittable): void {
    this.hittable.push(hittable.clone_hittable());
  }

  get_background_color(ray: Ray): Vec3 {
    const direction_unit = ray.direction.clone().unitize();
    const t = 0.5 * (direction_unit.y + 1);
    return lerp_vec3(
      t,
      this.background_gradient.start,
      this.background_gradient.end
    );
  }

  color_sample(ray: Ray, depth: number): Vec3 {
    if (depth <= 0) {
      return this.get_background_color(ray);
    }

    let closest_hit: Hit | MissedHit = { is_hit: false } as MissedHit;

    for (const current_hittable of this.hittable) {
      const hit = current_hittable.hits(ray);
      if (is_valid_hit(hit)) {
        if (!is_valid_hit(closest_hit) || hit.t < closest_hit.t) {
          closest_hit = hit;
        }
      }
    }

    if (!is_valid_hit(closest_hit)) {
      return this.get_background_color(ray);
    }

    const mat_result: MaterialResult = closest_hit.material.scatter(
      ray,
      closest_hit
    );
    if (!mat_result.should_scatter) {
      return this.get_background_color(ray);
    }

    return this.color_sample(mat_result.scattered, depth - 1).mul_vec(
      mat_result.attenuation
    );
  }

  draw_frame(): void {
    const image_data = this.context.createImageData(this.width, this.height);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let color = new Vec3(0, 0, 0);
        if (this.samples_per_pixel === 1) {
          const ray = this.camera.get_ray(x, y);
          color = unit_color_to_255(this.color_sample(ray, this.max_depth));
        } else {
          for (let i = 0; i < this.samples_per_pixel; i++) {
            let u = x + rand(0.5, 1.99);
            let v = y + rand(0.5, 1.99);
            if (u >= this.width) {
              u = this.width - 1;
            }
            if (v >= this.height) {
              v = this.height - 1;
            }

            const ray = this.camera.get_ray(u, v);
            color.add(this.color_sample(ray, this.max_depth));
          }
          color = multisample_unit_color_to_single_255(
            color,
            this.samples_per_pixel
          );
        }

        const index = ((this.height - y) * this.width + x) * 4;
        image_data.data[index] = color.x;
        image_data.data[index + 1] = color.y;
        image_data.data[index + 2] = color.z;
        image_data.data[index + 3] = 255;
      }
    }

    this.context.putImageData(image_data, 0, 0);
  }
}
