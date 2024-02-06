/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Locator } from '@playwright/test';
import type { JsonObject, JsonValue, } from '@playwright/experimental-ct-core/types/component';
import type { TestType } from '@playwright/experimental-ct-core';

type PickByValue<T, ValueType> = Pick<T, { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]>;

type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
type WritableKeysOf<T> = {[P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>}[keyof T];
type WritablePart<T> = Pick<T, WritableKeysOf<T>>;

type HTMLAttributes<Component extends HTMLElement> = Partial<WritablePart<PickByValue<Component, JsonValue>>>;
type CustomProperties<Component extends HTMLElement> = Partial<PickByValue<Component, JsonValue>>;
type ComponentProps<Component extends HTMLElement> = HTMLAttributes<Component> & CustomProperties<Component>;

type ComponentSlot = number | string | ComponentSlot[];
type ComponentSlots = Record<string, ComponentSlot> & { default?: ComponentSlot };

type ComponentEvents = Record<string, Function>;

export interface MountOptions<HooksConfig extends JsonObject, Component extends HTMLElement> {
  props?: ComponentProps<Component>;
  slots?: ComponentSlots;
  on?: ComponentEvents;
  hooksConfig?: HooksConfig;
}

export interface MountResult<Component extends HTMLElement> extends Locator {
  unmount(): Promise<void>;
  update(options: {
    props?: Partial<ComponentProps<Component>>;
    slots?: Partial<ComponentSlots>;
    on?: Partial<ComponentEvents>;
  }): Promise<void>;
}

export const test: TestType<{
  mount<HooksConfig extends JsonObject, Component extends HTMLElement = HTMLElement>(
    component: new (...args: any[]) => Component,
    options?: MountOptions<HooksConfig, Component>
  ): Promise<MountResult<Component>>;
}>;

export { defineConfig, PlaywrightTestConfig } from '@playwright/experimental-ct-core';
export { expect, devices } from '@playwright/test';
