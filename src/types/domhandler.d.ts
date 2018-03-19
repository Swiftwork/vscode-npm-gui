declare module 'domhandler' {
  export default class DomHandler {
    constructor(callback?, options?, elementCB?);

    oncdataend();

    oncdatastart();

    onclosetag();

    oncomment(data);

    oncommentend();

    onend();

    onerror(error);

    onopentag(name, attribs);

    onparserinit(parser);

    onprocessinginstruction(name, data);

    onreset();

    ontext(data);
  }
}