import { IDependency } from './manager';

export class Renderer {
  static Dependency(dependency: IDependency) {
    return `<li class="dependency">${dependency.name}<span class="version">${dependency.version}</span></li>`;
  }
}