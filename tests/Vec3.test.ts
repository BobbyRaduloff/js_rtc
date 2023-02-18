import Vec3, { cross, dot } from "@/lib/Vec3";

test("check empty constructor", () => {
  const v = new Vec3();
  expect(v.x).toBe(0);
  expect(v.y).toBe(0);
  expect(v.z).toBe(0);
});

test("check constructor", () => {
  const v = new Vec3(1, 2, 3);
  expect(v.x).toBe(1);
  expect(v.y).toBe(2);
  expect(v.z).toBe(3);
});

test("check get correct", () => {
  const v = new Vec3(1, 2, 3);
  expect(v.get(0)).toBe(1);
  expect(v.get(1)).toBe(2);
  expect(v.get(2)).toBe(3);
});

test("check get wrong", () => {
  const v = new Vec3();
  expect(() => v.get(-1)).toThrow(RangeError);
  expect(() => v.get(3)).toThrow(RangeError);
});

test("check clone", () => {
  const v = new Vec3(1, 2, 3);
  const u = v.clone();
  expect(v).not.toBe(u);
  expect(v).toEqual(u);
});

test("check negation", () => {
  const v = new Vec3(1, 2, 0);
  v.neg();
  expect(v.x).toBe(-1);
  expect(v.y).toBe(-2);
  expect(v.z).toBe(-0);
});

test("check addition", () => {
  const v = new Vec3(1, 2, 3);
  const u = new Vec3(0, -3, 4);
  v.add(u);
  expect(v.x).toBe(1);
  expect(v.y).toBe(-1);
  expect(v.z).toBe(7);
});

test("check subtraction", () => {
  const v = new Vec3(1, 2, 3);
  const u = new Vec3(0, -3, 4);
  v.sub(u);
  expect(v.x).toBe(1);
  expect(v.y).toBe(5);
  expect(v.z).toBe(-1);
});

test("check multiplication", () => {
  const v = new Vec3(1, 2, 3).mul(3);
  expect(v.x).toBe(3);
  expect(v.y).toBe(6);
  expect(v.z).toBe(9);
});

test("check division correct", () => {
  const v = new Vec3(3, 6, 9).div(3);
  expect(v.x).toBe(1);
  expect(v.y).toBe(2);
  expect(v.z).toBe(3);
});

test("check division by 0", () => {
  const v = new Vec3();
  expect(() => v.div(0)).toThrow(RangeError);
});

test("check length", () => {
  const v = new Vec3(3, 6, 9);
  expect(v.length()).toBeCloseTo(11.2249721603);
});

test("check dot product", () => {
  const v = new Vec3(1, 2, 3);
  const u = new Vec3(0, -1, 4);
  const res = dot(v, u);
  expect(res).toBe(10);
});

test("check cross product", () => {
  const v = new Vec3(1, 2, 3);
  const u = new Vec3(0, -1, 4);
  const res = cross(u, v);
  expect(res.x).toBe(u.get(1) * v.get(2) - u.get(2) * v.get(1));
  expect(res.y).toBe(u.get(2) * v.get(0) - u.get(0) * v.get(2));
  expect(res.z).toBe(u.get(0) * v.get(1) - u.get(1) * v.get(0));
});
