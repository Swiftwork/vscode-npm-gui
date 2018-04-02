import * as fs from 'fs';
import * as ncu from 'npm-check-updates';
import * as path from 'path';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DependencyType, IDependencies, IDependency } from './interfaces';

export class Dependencies {

  protected map$ = new BehaviorSubject<Map<string, IDependency>>(null);
  public map = this.map$.asObservable();

  constructor() { }

  public checkDependencies(contents: string) {
    const metadata = JSON.parse(contents);
    ncu.run({
      packageData: contents,
    }).then((updates) => {
      console.log(updates);
      this.map$.next(this.formatDependencies(metadata, updates));
    }).catch((err, err2) => {
      console.warn(err);
    });
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
