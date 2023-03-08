import {concat, IDENT44, Mat, rotationAroundAxis44, invert44, scale44, translation44} from "@thi.ng/matrices";
import { SVGT} from "./svgt";
import {Vec} from "@thi.ng/vectors";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {svg} from 'htl';

import * as math from 'mathjs';

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

export const cssTransform = (obj: SVGT) =>
    (mat: Mat) => {
        const t4 = math.transpose(math.reshape(<number[]> mat,[4,4]));
        const t23 = math.subset(t4,math.index([0,1],[0,1,2]));
        const t32 = math.subset(t4,math.index([0,1,2],[0,1]));
        const t22 = math.subset(t4,math.index([0,1],[0,1]));
        const t33 = math.subset(t4,math.index([0,1,2],[0,1,2]));
        const {values,vectors} = math.eigs(math.multiply(math.transpose(math.inv(t22)),math.inv(t22)));

        //const rot = math.transpose(vectors);
        const rotscale = math.multiply(vectors,math.diag(values));

        const vals = [...<number[]>values];//.slice(1,3);
        const scaleinv = math.diag([...vals.map(x=>Math.sqrt(x)),1,1]);
        //vals.reverse();
        const scale = scale44([],[...vals.map(x=>Math.sqrt(1/x)),1,1]);
        // const t = math.resize(math.multiply(scale,rot),[4,4]);
        // const ut = <number[]><unknown> math.flatten(math.transpose(t));
        console.log(mat);
        console.log(vals);
        //const cssmat = concat([],mat,invert44([],scale)!);

        const right = math.subset(t4,math.index([0,1,2],[3]));
        // const right = math.add(0,math.multiply(math.subset(scaleinv,math.index([0,1,2],[0,1,2])),right1));

        const bottom =math.multiply(math.subset(t4,math.index([3],[0,1,2,3])), scaleinv);
        const bigger = math.concat(math.concat(vectors, [[0],[0]], 1), [[0,0,1]],0);
        const joint = math.concat(math.concat(bigger, right, 1), bottom, 0);
        console.log(joint);
        const cssmat = (<number[]> math.flatten(math.transpose(joint)));
        console.log(cssmat);

        return svg.fragment`<g ${{style: `transform: matrix3d(${(<number[]> cssmat).join(',')})`}}>${obj(scale)}</g>`
    };

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
