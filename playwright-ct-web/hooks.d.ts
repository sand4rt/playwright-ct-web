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

export declare function beforeMount<HooksConfig, StaticProperties extends Record<string, any> = {}>(
  callback: (params: {
      hooksConfig?: HooksConfig;
      App: { new (...args: any[]): HTMLElement } & StaticProperties;
  }) => Promise<void>
): void;

export declare function afterMount<HooksConfig, Component extends HTMLElement = HTMLElement>(
  callback: (params: {
      hooksConfig?: HooksConfig;
      element: Component
  }) => Promise<void>,
): void;
