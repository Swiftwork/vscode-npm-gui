import * as fs from 'fs';
import * as ncu from 'npm-check-updates';
import * as path from 'path';
import * as vscode from 'vscode';

export enum DependencyType {
  PRODUCTION = 'dependencies',
  DEVELOPMENT = 'devDependencies',
  PEER = 'peerDependencies',
  OPTIONAL = 'optionalDependencies',
}

export interface IDependency {
  name: string,
  version: string,
  latest: string,
  type: string,
}

export interface IDependencies {
  [name: string]: string,
}

export interface IDependencyCache {
  [id: string]: {
    text: string,
    data: object,
    deps?: Map<string, IDependency>,
  },
}

export class Dependencies {

  private _cached: IDependencyCache = {};

  constructor() { }

  public update(uri: vscode.Uri, dependency: string) {
    const id = uri.toString();
    const cached = this._cached[id];
    if (!cached) return null;
    const dep = cached.deps.get(dependency);
    dep.version = dep.latest;
    cached.data[dep.type][dependency] = dep.version;
    cached.text = JSON.stringify(cached.data, null, 2);
    return cached.text;
  }

  public async checkDependencies(uri: vscode.Uri, contents: string) {
    const id = uri.toString();
    console.log('[check]\t', id);
    if (!this._cached[id] || contents !== this._cached[id].text) {
      console.log('[fetch]\t', id);
      const metadata = JSON.parse(contents);
      this._cached[id] = { text: contents, data: metadata };
      try {
        const updates = await ncu.run({ packageData: contents });
        const dependencies = this.formatDependencies(metadata, updates);
        this._cached[id].deps = dependencies;
        return dependencies;
      } catch (err) {
        delete this._cached[id];
        console.warn(err);
        return null;
      }
    } else {
      console.log('[cache]\t', id);
      return this._cached[id].deps;
    }
  }

  public formatDependencies(metadata: { [key: string]: any }, updates: IDependencies) {
    const map = new Map<string, IDependency>();

    for (let key in DependencyType) {
      if (!isNaN(Number(key))) continue;
      const type = DependencyType[key];
      const dependencies = metadata[type];

      for (const name in dependencies) {
        map.set(name, {
          name: name,
          version: dependencies[name],
          latest: updates[name] || dependencies[name],
          type: type,
        });
      }
    }
    return map;
  }
}
