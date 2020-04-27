import { ChildTree } from './childTree'

export class ParentTree {
    type: string;
    filename: string;
    path: string;
    hidden: string;
    children?: ChildTree[];
}
