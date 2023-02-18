import Ray from "@/lib/Ray";
import Vec3 from "@/lib/Vec3";

test("check default constructor", () => {
  const r = new Ray();
  expect(r.origin).toEqual(new Vec3());
  expect(r.direction).toEqual(new Vec3());
});

test("check constructor", () => {
  const origin = new Vec3(1, 2, 3);
  const direction = new Vec3(3, 4, 5);
  const r = new Ray(origin, direction);
  expect(r.origin).toEqual(origin);
  expect(r.direction).toEqual(direction);
  expect(r.origin).not.toBe(origin);
  expect(r.direction).not.toBe(direction);
});

test("check at", () => {
  const origin = new Vec3(1, 2, 3);
  const direction = new Vec3(3, 4, 5);
  const r = new Ray(origin, direction);
  expect(r.at(3)).toEqual(new Vec3(10, 14, 18));
  expect(r.direction).toEqual(r.direction);
  expect(r.origin).toEqual(r.origin);
});
