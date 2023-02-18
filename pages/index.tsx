import React from "react";
import Head from "next/head";
import Vec3 from "@/lib/Vec3";
import Sphere from "@/lib/Sphere";
import { Diffuse, Metalic } from "@/lib/Material";
import RTCanvas from "@/components/RTCanvas";

type State = {
  objects: Sphere[];
  width: number;
  height: number;
  max_depth: number;
  samples_per_pixel: number;
  should_render: boolean;
};

type Action = {
  type:
    | "SET_WIDTH"
    | "SET_HEIGHT"
    | "SET_MAX_DEPTH"
    | "SET_SAMPLES_PER_PIXEL"
    | "BEGIN_RENDER";
  payload: number;
};

const initial_state: State = {
  objects: [
    new Sphere(new Vec3(0, 0, -1), 0.5, new Diffuse(new Vec3(0.8, 0.3, 0.0))),
    new Sphere(
      new Vec3(1.25, 0, -2),
      0.5,
      new Diffuse(new Vec3(0.7, 0.3, 0.3))
    ),
    new Sphere(
      new Vec3(-1.25, -0.2, -2),
      0.3,
      new Metalic(new Vec3(0.8, 0.8, 0.8), 1)
    ),
    new Sphere(
      new Vec3(0, -100.5, -1),
      100,
      new Diffuse(new Vec3(0.8, 0.6, 0.2))
    ),
  ],
  width: 640,
  height: 480,
  max_depth: 50,
  samples_per_pixel: 100,
  should_render: false,
};

function reducer(state: State, action: Action): State {
  if (action.type === "BEGIN_RENDER") {
    return { ...state, should_render: true };
  } else if (action.type === "SET_WIDTH") {
    return { ...state, width: action.payload };
  } else if (action.type === "SET_HEIGHT") {
    return { ...state, height: action.payload };
  } else if (action.type === "SET_MAX_DEPTH") {
    return { ...state, max_depth: action.payload };
  } else if (action.type === "SET_SAMPLES_PER_PIXEL") {
    return { ...state, samples_per_pixel: action.payload };
  } else {
    return state;
  }
}

export default function Home() {
  const [state, dispatch] = React.useReducer(reducer, initial_state);

  return (
    <>
      <Head>
        <title>Browser-based Raytracing: Pure JS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="p-16 w-[100vw] h-[100vh] flex flex-col justify-start items-center gap-4">
        <h1 className="text-4xl">Browser-based Raytracing: Pure JS</h1>
        {state.should_render && <RTCanvas {...state} />}
        <div className="flex flex-row justify-evenly gap-4">
          <div className="flex flex-col justify-center items-start">
            <label>Width</label>
            <input
              className="bg-gray-200 border-1 border-black px-2 rounded-lg"
              type="number"
              value={state.width}
              onChange={(e) =>
                dispatch({
                  type: "SET_WIDTH",
                  payload: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="flex flex-col justify-center items-start">
            <label>Height</label>
            <input
              type="number"
              value={state.height}
              className="bg-gray-200 border-1 border-black px-2 rounded-lg"
              onChange={(e) =>
                dispatch({
                  type: "SET_HEIGHT",
                  payload: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="flex flex-row justify-evenly gap-4">
          <div className="flex flex-col justify-center items-start">
            <label>Max Depth (Bounce)</label>
            <input
              type="number"
              value={state.max_depth}
              className="bg-gray-200 border-1 border-black px-2 rounded-lg"
              onChange={(e) =>
                dispatch({
                  type: "SET_MAX_DEPTH",
                  payload: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className="flex flex-col justify-center items-start">
            <label>AA: Samples per pixel</label>
            <input
              type="number"
              value={state.samples_per_pixel}
              className="bg-gray-200 border-1 border-black px-2 rounded-lg"
              onChange={(e) =>
                dispatch({
                  type: "SET_SAMPLES_PER_PIXEL",
                  payload: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
        <button
          className="rounded-xl bg-green-300 px-2 text-center text-2xl"
          onClick={() => {
            dispatch({ type: "BEGIN_RENDER", payload: 0 });
          }}
        >
          Render!
        </button>
      </main>
    </>
  );
}
