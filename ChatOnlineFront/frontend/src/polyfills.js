import global from "global";

if (typeof window !== "undefined") {
  window.global = global;
}