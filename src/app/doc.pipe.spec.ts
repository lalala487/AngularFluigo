import { DocPipe } from './doc.pipe';

describe('DocPipe', () => {
  it('create an instance', () => {
    const pipe = new DocPipe(undefined);
    expect(pipe).toBeTruthy();
  });
});
