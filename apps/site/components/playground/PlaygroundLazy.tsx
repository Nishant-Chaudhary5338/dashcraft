"use client";
import dynamic from "next/dynamic";

const PlaygroundApp = dynamic(
  () => import("./PlaygroundApp").then((m) => m.PlaygroundApp),
  { ssr: false, loading: () => null }
);

export function PlaygroundLazy() {
  return <PlaygroundApp />;
}
