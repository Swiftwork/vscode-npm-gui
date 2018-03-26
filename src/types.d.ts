declare module "*.css" {
  const style: string;
  export default style;
}

declare module "*.hbs" {
  const template: (context?: object) => string;
  export default template;
}
