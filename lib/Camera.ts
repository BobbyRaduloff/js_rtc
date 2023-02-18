import Vec3 from "@/lib/Vec3";
import Ray from "@/lib/Ray";

export default class Camera {
  image_width: number;
  image_height: number;
  aspect_ratio: number;
  viewport_width: number;
  viewport_height: number;
  lower_left_corner: Vec3;
  origin: Vec3;
  horizontal: Vec3;
  vertical: Vec3;
  focal_length: number;

  constructor(image_width = 640, image_height = 480) {
    this.origin = new Vec3();
    this.image_width = image_width;
    this.image_height = image_height;
    this.aspect_ratio = image_width / image_height;
    this.viewport_height = 2;
    this.viewport_width = this.aspect_ratio * this.viewport_height;
    this.horizontal = new Vec3(this.viewport_width, 0, 0);
    this.vertical = new Vec3(0, this.viewport_height, 0);
    this.focal_length = 1;
    this.lower_left_corner = this.origin
      .clone()
      .sub(this.horizontal.clone().div(2))
      .sub(this.vertical.clone().div(2))
      .sub(new Vec3(0, 0, this.focal_length));
  }

  clone(): Camera {
    return new Camera(this.image_width, this.image_height);
  }

  get_ray(x: number, y: number): Ray {
    if (x >= this.image_width) {
      throw new RangeError(
        `cannot cast ray at x = ${x}, image is only ${this.image_width} wide`
      );
    }
    if (y >= this.image_height) {
      throw new RangeError(
        `cannot cast ray at y = ${y}, image is only ${this.image_height} tall`
      );
    }
    if (x < 0) {
      throw new RangeError(`cannot cast ray at x = ${x}, image starts from 0`);
    }
    if (y < 0) {
      throw new RangeError(`cannot cast ray at y = ${y}, image starts from 0`);
    }

    const u = x / (this.image_width - 1);
    const v = y / (this.image_height - 1);
    return new Ray(
      this.origin,
      this.lower_left_corner
        .clone()
        .add(this.horizontal.clone().mul(u))
        .add(this.vertical.clone().mul(v))
        .sub(this.origin)
    );
  }
}
