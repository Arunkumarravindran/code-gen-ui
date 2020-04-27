import { ChildTree } from './childTree'

export class ParentTree {
    type: string;
    filename: string;
    path: string;
    hidden: string;
    language: string;
    content: string;
    children?: ChildTree[];
}
