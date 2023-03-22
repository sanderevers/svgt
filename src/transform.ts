import {
    concat,
    IDENT44,
    Mat,
    rotationAroundAxis44,
    scale44,
    translation44,
} from "@thi.ng/matrices";
import { SVGT} from "./svgt";
import {Vec} from "@thi.ng/vectors";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {svg} from 'htl';

// import * as math from 'mathjs';

// NB obj en args omgekeerd!
export function transform(obj: SVGT, ...args: Mat[]): SVGT {
    if (args.length==0) return obj;
    const [first, ...rest] = args;
    return (mat:Mat) => obj(concat([],mat, first, ...rest));
}

export const scale = (xyz: Vec|number, obj: SVGT) => transform(obj, scale44([],xyz));

export const translate = (xyz: Vec, obj: SVGT) => transform(obj, translation44([],xyz));

export const rotateX = (rad: number, obj: SVGT) => transform(obj, rotationAroundAxis44([],[1,0,0],rad));

export const rotateY = (rad: number, obj:SVGT) => transform(obj, rotationAroundAxis44([],[0,1,0],rad));

export const rotateZ = (rad: number, obj:SVGT) => transform(obj, rotationAroundAxis44([],[0,0,1],rad));

export function g(...objs: SVGT[]): SVGT {
    return (mat:Mat) => objs.flatMap(obj => obj(mat))
}

export const identity = IDENT44



export const css = (obj: SVGT) =>
    (mat: Mat) => {
        return svg.fragment`<g ${{style: `transform: matrix3d(${(<number[]> mat).join(',')})`}}>${obj(IDENT44)}</g>`
    };

// export const cssTransform = (obj: SVGT) =>
//     (mat: Mat) => {
//         const dia = diag44([],mat);
//         //dia[1]=-dia[1];
//         //dia[1]=dia[0];
//         dia[2]=1;
//         dia[3]=1;
//         const scale = scale44([],dia);
//         console.log(scale);
//         const cssmat = concat([],mat,invert44([],scale)!);
//         return svg.fragment`<g ${{style: `transform: matrix3d(${(<number[]> cssmat).join(',')})`}}>${obj(scale)}</g>`
//     };

// export const cssTransform = (obj: SVGT) => {
//     const getElements = (mat: Mat) => (<number[]> mat).join(',');
//     return svgt`<g ${{style: `transform: matrix3d(${getElements})`}}>${obj(identity)}</g>`
// };
