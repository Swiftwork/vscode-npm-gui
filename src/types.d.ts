declare module "*.css" {
  const style: string;
  export = style;
}

declare module "*.hbs" {
  const template: (context?: object) => string;
  export = template;
}
