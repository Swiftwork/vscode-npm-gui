declare module '*.mjs' {
  const path: string;
  export = path;
}

declare module '*.css' {
  const path: string;
  export = path;
}

declare module '*.hbs' {
  const template: (context?: object) => string;
  export = template;
}
