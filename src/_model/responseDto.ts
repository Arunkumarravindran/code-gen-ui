import { Packaging } from './packaging'
import { JavaVersion } from './javaVersion'
import { Language } from './language'
import { BootVersion } from './bootVersion'
import { GroupId } from './groupId'
import { ArtifactId } from './artifactId'
import { Version } from './version'
import { Name } from './name'
import { Description } from './description'
import { PackageName } from './packageName'
import { Dependencies } from './dependencies'
import { Type } from './type'


export class ResponseDto{
    dependencies:Dependencies
    type:Type
    packaging: Packaging
    javaVersion:JavaVersion 
    language: Language
    bootVersion:BootVersion
    groupId: GroupId
    artifactId: ArtifactId
    version: Version
    name: Name
    description: Description
    packageName:PackageName
}