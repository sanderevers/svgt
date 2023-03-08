import { svgt, svgtScreenBox  } from './node'

test('svgtScreenBox copies x,y coordinates', () => {
    const obj = svgt`<line x1=${10} y1=${20} ${30} ${{}} x2=${40} y2=${50} ${60}/>`
    const svg = svgtScreenBox(obj, 100, 100);
    const out = new XMLSerializer().serializeToString(svg);
    expect(out).toBe(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0,0 100,100"><line x1="10" y1="20" x2="40" y2="50"/></svg>`)
});


