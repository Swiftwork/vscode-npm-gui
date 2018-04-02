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
    // Mock
    this.map$.next(this.formatDependencies(metadata, {
      'npm-check-updates': '^3.14.1',
      'vscode': '^1.1.16',
      '@types/mocha': '^2.5.48',
      'css-loader': '^1.28.11',
      'handlebars-loader': '^1.71.0',
      'thread-loader': '^1.1.6',
      'tslint': '^5.9.2',
      'typescript': '^2.8.2',
      'webpack-cli': '^2.0.14',
    }));
    /*
    ncu.run({
      packageData: contents,
    }).then((updates) => {
      this.map$.next(this.formatDependencies(metadata, updates));
    }).catch((err) => {
      console.warn(`Failed to fetch updates: ${err}`);
    });
    */
  }

  public formatDependencies(metadata: { [key: string]: any }, updates: IDependencies) {
    const map = new Map<string, IDependency>();
    const peer = metadata.peerDependencies;
    const prod = metadata.dependencies;
    const dev = metadata.devDependencies;
    for (const name in peer) {
      map.set(name, {
        name: name,
        version: peer[name],
        latest: updates[name] || peer[name],
        type: DependencyType.PEER,
      });
    }
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
    return map;
  }
}
