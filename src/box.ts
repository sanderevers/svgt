import {mat23to44, viewport} from "@thi.ng/matrices";
import type {SVGT} from "./svgt";
import {identity} from './transform'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {svg} from 'htl';

export function svgtBox(obj: SVGT, width: number,height:number) {
    const toScreen = mat23to44([],viewport([],0,width,height,0));
    return svg`<svg width=${width} height=${height} viewBox="0,0 ${width},${height}">${obj(toScreen)}</svg>`
}

export function svgtScreenBox(obj: SVGT,width:number,height:number) {
    return svg`<svg width=${width} height=${height} viewBox="0,0 ${width},${height}">${obj(identity)}</svg>`
}
