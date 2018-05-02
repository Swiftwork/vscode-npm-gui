import * as fs from 'fs';
import * as ncu from 'npm-check-updates';
import * as path from 'path';
import * as vscode from 'vscode';

export enum DependencyType {
  PRODUCTION, DEVELOPMENT, PEER, OPTIONAL,
}

export interface IDependency {
  name: string,
  version: string,
  latest: string,
  type: DependencyType,
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
    cached.data[dependency] = cached.deps.get(dependency).latest;
    cached.text = JSON.stringify(cached.data, null, 2);
    return cached.text;
  }

  public checkDependencies(uri: vscode.Uri, contents: string) {
    const id = uri.toString();
    if (!this._cached[id] || contents !== this._cached[id].text) {
      console.log(id);
      const metadata = JSON.parse(contents);
      this._cached[id] = { text: contents, data: metadata };
      return ncu.run({
        packageData: contents,
      }).then((updates) => {
        console.log('fetch');
        const dependencies = this.formatDependencies(metadata, updates);
        this._cached[id].deps = dependencies;
        return dependencies;
      }).catch((err, err2) => {
        delete this._cached[id];
        console.warn(err);
      });
    } else {
      console.log('cached');
      return Promise.resolve(this._cached[id].deps);
    }
  }

  public formatDependencies(metadata: { [key: string]: any }, updates: IDependencies) {
    const map = new Map<string, IDependency>();
    const prod = metadata.dependencies;
    const dev = metadata.devDependencies;
    const peer = metadata.peerDependencies;
    const opt = metadata.optionalDependencies;
    for (const name in prod) {
      map.set(name, {
        name: name,
        version: prod[name],
        latest: updates[name] || prod[name],
        type: DependencyType.PRODUCTION,
      });
    }
    for (const name in dev) {
      map.set(name, {
        name: name,
        version: dev[name],
        latest: updates[name] || dev[name],
        type: DependencyType.DEVELOPMENT,
      });
    }
    for (const name in peer) {
      map.set(name, {
        name: name,
        version: peer[name],
        latest: updates[name] || peer[name],
        type: DependencyType.PEER,
      });
    }
    for (const name in opt) {
      map.set(name, {
        name: name,
        version: opt[name],
        latest: updates[name] || opt[name],
        type: DependencyType.OPTIONAL,
      });
    }
    return map;
  }
}
