import assert from "node:assert/strict";
import test from "node:test";
import { FarViewCore, generateSpatialFarOffsets } from "../src/core/far-view.js";

test("spatial far-view generator produces 100 unique two-dimensional targets", () => {
  const offsets = generateSpatialFarOffsets(100);
  assert.equal(offsets.length, 100);
  assert.equal(new Set(offsets.map(({ dx, dz }) => `${dx}:${dz}`)).size, 100);
  assert.ok(offsets.some(({ dx }) => dx < 0));
  assert.ok(offsets.some(({ dx }) => dx > 0));
  assert.ok(offsets.some(({ dz }) => dz < 0));
  assert.ok(offsets.some(({ dz }) => dz > 0));
  assert.ok(offsets.every(({ dx, dz }) => Math.hypot(dx, dz) <= 100));
  assert.ok(offsets.some(({ dx, dz }) => Math.hypot(dx, dz) >= 99));
});

test("spatial far-view generator is deterministic", () => {
  assert.deepEqual(generateSpatialFarOffsets(100), generateSpatialFarOffsets(100));
  assert.deepEqual(generateSpatialFarOffsets(17), generateSpatialFarOffsets(17));
});

test("spatial far-view generator has bounded input", () => {
  assert.throws(() => generateSpatialFarOffsets(0), /count must be an integer/);
  assert.throws(() => generateSpatialFarOffsets(101), /count must be an integer/);
  assert.throws(() => generateSpatialFarOffsets(1.5), /count must be an integer/);
});

test("render capability does not claim engine or client rendering proof", () => {
  const core = new FarViewCore();
  assert.equal(core.renderCapability(100, 128).capability, "CLIENT_LIMIT_ALLOWS_REQUEST");
  assert.equal(core.renderCapability(100, 64).capability, "CLIENT_LIMIT_UNKNOWN");
  assert.equal(core.renderCapability(100, null).capability, "CLIENT_LIMIT_UNKNOWN");
});
