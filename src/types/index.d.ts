export {};

declare global {
  interface Window {
    gtag: any;
  }
}

declare module 'superagent-xml2jsparser' {
  var x: any;
  export = x;
}