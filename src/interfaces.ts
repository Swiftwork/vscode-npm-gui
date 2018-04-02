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
