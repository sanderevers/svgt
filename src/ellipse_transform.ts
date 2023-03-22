import {concat, invert, Mat, row, scale44, transpose22} from "@thi.ng/matrices";
import {normalize} from "@thi.ng/vectors";

function eig22(mat22: Mat): {values: [number,number], vectors:Mat} {
    // https://math.stackexchange.com/questions/395698/fast-way-to-calculate-eigen-of-2x2-matrix-using-a-formula
    // console.log(mat22);
    const eps = 1e-14;
    const [a,c,b,d] = mat22;
    const tr = a+d;
    const det = a*d-b*c;
    const val1 = 0.5*tr - Math.sqrt(0.25*tr*tr - det);
    const val2 = 0.5*tr + Math.sqrt(0.25*tr*tr - det);
    const values:[number,number] = [val1,val2];
    let vec1:[number,number], vec2:[number,number];
    if (Math.abs(c)>eps) {
        vec1 = [val1-d, c];
        vec2 = [val2-d, c];
    } else if (Math.abs(b)>eps) {
        vec1 = [b, val1-a];
        vec2 = [b, val2-a];
    } else {
        vec1 = [1,0];
        vec2 = [0,1];
        return {values:[a,d], vectors:[...vec1,...vec2]};
    }
    const vectors = [...normalize([],vec1),...normalize([],vec2)];
    return {values, vectors};
}

export function ellipse_transform(mat: Mat): {css_transform: number[], rxy_transform: Mat} {
    const mat22inv = <Mat> invert([],[mat[0],mat[1],mat[4],mat[5]]);
    const {values,vectors} = eig22(concat([],transpose22([],mat22inv), mat22inv))
    const scale_bottom =  scale44([],[...values.map(x=>1/x),1,1]);
    const rxy_transform = scale44([],[...values.map(x=>Math.sqrt(1/x)),1,1]);
    const sb = concat([],row([],mat,3),scale_bottom);
    const css_transform = [vectors[0],vectors[1],0,sb[0], vectors[2],vectors[3],0,sb[1], 0,0,1,sb[2], mat[12],mat[13],mat[14],mat[15]];

    return {css_transform,rxy_transform};
}
