import React from "react";
import Scene from "@/lib/Scene";
import Hittable from "@/lib/Hittable";

type Props = {
  width: number;
  height: number;
  objects: Hittable[];
  max_depth: number;
  samples_per_pixel: number;
};

export default function RTCanvas({
  width,
  height,
  objects,
  max_depth,
  samples_per_pixel,
}: Props) {
  const canvas_ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvas_ref.current) {
      return;
    }

    const context = canvas_ref.current.getContext("2d");
    if (!context) {
      return;
    }

    const scene = new Scene(
      width,
      height,
      context,
      max_depth,
      samples_per_pixel
    );
    for (const object of objects) {
      scene.add(object);
    }

    scene.draw_frame();
  }, [canvas_ref]);

  return (
    <canvas ref={canvas_ref} width={width} height={height}>
      Please use a browser that supports HTML canvas.
    </canvas>
  );
}
