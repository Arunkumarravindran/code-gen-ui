import { Dependencies } from './dependencies';
import { DbDetails } from './db/DbDetails';
import { Value } from './addOns/typeValue';

export class CustomResponseDto{
    nexus:Dependencies;
    dbDetails:DbDetails;
    addOns: Value[];
}