export enum DependencyType {
  PRODUCTION, DEVELOPMENT, PEER,
}

export interface IDependency {
  name: string,
  version: string,
}
