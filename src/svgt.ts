import {Mat, mulV} from '@thi.ng/matrices';
import {Vec} from "@thi.ng/vectors";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {svg} from 'htl';
import {ellipse_transform} from "./ellipse_transform";

export type SVGT = (mat: Mat) => DocumentFragment[];

export function svgt(strings: TemplateStringsArray,...args:unknown[]): SVGT {
    const {vecs,getargs} = process_params(args);
    return (mat:Mat) => {
        const fullvecs = vecs.map(v => Object.assign([0,0,0,1],v));
        const tvecs = fullvecs.map(transform_vector(mat));
        const newargs = getargs.map(f => f(tvecs,mat));
        return [svg.fragment(strings,...newargs)];
    }
}

// Process all template parameters.
// Collect input vectors from numbers, arrays and arrays-of-arrays.
// Also return, for each parameter, a function that determines the output value
// that is substituted into the template string. (This function is applied to
// the transformed input vectors and the transformation matrix.)
function process_params(args:unknown[]) {
    let invec = false;
    const vecs:number[][] = [];
    const getargs: ((v:[number,number][], mat:Mat) => string|object|number)[] = [];
    for (const arg of args) {
        if (typeof(arg)==='number') {
            if (!invec) vecs.push([]);
            invec=true;
            const curvec = vecs.length-1;
            const curel = vecs[curvec].length;
            vecs[curvec].push(arg);
            getargs.push(tvecs => tvecs[curvec][curel] ?? '');
        } else {
            invec=false;
            if (typeof(arg)==='object' && Array.isArray(arg)) {
                const arrays = Array.isArray(arg[0]) ? arg : [arg];
                const firstvec = vecs.length;
                const nvecs = arrays.length;
                for (const arr of arrays) {
                    vecs.push(arr);
                }
                getargs.push(tvecs => tvecs.slice(firstvec, firstvec + nvecs).map(vec => vec.join(',')).join(' '));
            } else if (arg===null || arg===undefined) {
                getargs.push(_tvecs => '')
            } else if (typeof(arg)==='object') {
                let newarg = {};
                if (Object.keys(arg).includes('rxy')) {
                    getargs.push((_tvecs,mat) => {
                        const {css_transform, rxy_transform} = ellipse_transform(mat);
                        const [rx,ry] = mulV([],rxy_transform,[...(<{rxy:number[]}>arg).rxy,0,0]);
                        const style = `transform: matrix3d(${css_transform.join(',')})`;
                        newarg = {...arg,rxy:undefined,style,rx,ry};
                        return newarg;
                    });
                } else {
                    getargs.push(_tvecs => arg);
                }
            } else if (typeof(arg)==='function') {
                getargs.push((_tvecs,mat) => arg(mat));
            } else {
                getargs.push(_tvecs => `${arg}`);
            }
        }
    }
    return {vecs,getargs};
}

const transform_vector: (mat:Mat) => (v:Vec) => [number,number] = (mat:Mat) => (v:Vec) => {
    const tv = mulV([],mat,v);
    if (tv[3]===0)
        return [tv[0],tv[1]];
    return [tv[0]/tv[3],tv[1]/tv[3]];
}

