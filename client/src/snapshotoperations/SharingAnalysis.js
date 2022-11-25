import { DeviantAnalysisResult, 
    FileFolderDifferences, 
    FileFolderDifferenceAnalysisResult,
    PermissionDifferences,
    CompareSnapshotsResults  } from "../classes/AnalysisResult";
import { File } from '../classes/file-class';

function compareSnapshots(snapshot1, snapshot2){
    //putting all files into a map where key is their id
    let idToFileMap1 = makeIdToFileMap(snapshot1.root);
    let idToFileMap2 = makeIdToFileMap(snapshot2.root);
    let snap2Ids = idToFileMap2.keys();
    let differenceMap = new Map();
    let key = 0;
    while((key = snap2Ids.next().value) !== undefined){
        if(idToFileMap1.get(key) === undefined){
            differenceMap.set(key, new PermissionDifferences(idToFileMap2.get(key), idToFileMap2.get(key).permissions));
        }else{
            differenceMap.set(key, comparePermissions(idToFileMap1.get(key), idToFileMap2.get(key)), true);
        }
    }
    return new CompareSnapshotsResults(differenceMap);
}

function comparePermissions(file1, file2, needToStringify){
    let permissionsMap = new Map();
    for(let permission of file1.permissions){
        permission = permission.basePermission;
        if(needToStringify){
            permissionsMap.set(JSON.stringify(permission), 1);
        }else{
            permissionsMap.set(permission, 1);
        }
    }
    for(let permission of file2.permissions){
        permission = permission.basePermission;
        if(needToStringify){
            permissionsMap.set(JSON.stringify(permission), permissionsMap.get(JSON.stringify(permission)) === undefined ? -1 : 0);
        }else{
            permissionsMap.set(permission, permissionsMap.get(permission) === undefined ? -1 : 0);
        }
    }
    let file2Removals = [...permissionsMap.entries()].filter(e => e[1] === 1).map(x => JSON.parse(x[0]));
    let file2Additions = [...permissionsMap.entries()].filter(e => e[1] === -1).map(x => JSON.parse(x[0]));
    let samePermissions = [...permissionsMap.entries()].filter(e => e[1] === 0).map(x => JSON.parse(x[0]));
    return new PermissionDifferences(file2, file2Additions, file2Removals, samePermissions);

}

function makeIdToFileMap(file){
    let idToFile = new Map();
    for(let subFile of file.files){
        idToFile = new Map(...idToFile, ...makeIdToFileMap(subFile));
    }
    idToFile.set(file.id, file);
    return idToFile;
}

/**
 * Deviant analysis. Limitations: threshold must be above .5.
 * @param folder folder whose files to perform analysis on
 * @returns results of deviant analysis.
 */
function findDeviantSharing(folder, threshold) {
    let permissionsMap = new Map();
    for (let file of folder.files) {
        let permissionSet = JSON.stringify(file.permissions);
        if (permissionsMap.has(permissionSet)) {
            permissionsMap.set(permissionSet, [...permissionsMap.get(permissionSet), file]);
        } else {
            permissionsMap.set(permissionSet, [file]);
        }
    }
    let majority = [...permissionsMap.entries()].reduce((a, e) => e[1].length > a[1].length ? e : a);
    let deviantFiles = [];
    if (majority[1].length / folder.files.length >= threshold) {
        for (let permissionSet of permissionsMap.entries()) {
            if (permissionSet[0] !== majority[0]) {
                let fileWithMajorityPermissions = new File("", "", JSON.parse(majority[0]));
                let permissionDifferences = comparePermissions(fileWithMajorityPermissions, permissionSet[1][0], true);
                let deviantDifferences = [];
                for(let file of permissionSet[1]){
                    deviantDifferences = new PermissionDifferences(file, 
                        permissionDifferences.addedPermissions, permissionDifferences.removedPermissions, 
                        permissionDifferences.samePermissions);
                }
                deviantFiles = deviantFiles.concat(deviantDifferences);
            }
        }
    }
    majority[0] = JSON.parse(majority[0]);
    return new DeviantAnalysisResult(folder, majority, deviantFiles, threshold);
}

function findFileFolderSharingDifferences(folder){
    let folderPermissionsMap = new Map();
    let differences = [];
    for(let permission of folder.permissions){
        permission = permission.basePermission;
        permission = JSON.stringify(permission);
        folderPermissionsMap.set(permission, 1);
    }
    for(let file of folder.files) {
        let permissionsMap = new Map(folderPermissionsMap);
        for(let permission of file.permissions){
            permission = permission.basePermission;
            permission = JSON.stringify(permission);
            if(permissionsMap.has(permission)){
                permissionsMap.set(permission, 0);
            }else{
                permissionsMap.set(permission, -1);
            }
        }
        //in folder but not file
        let folderDifferences = [...permissionsMap.entries()].filter(e => e[1] === 1).map(x => JSON.parse(x[0]));
        //in file but not folder
        let fileDifferences = [...permissionsMap.entries()].filter(e => e[1] === -1).map(x => JSON.parse(x[0]));
        if(folderDifferences.length !== 0 || fileDifferences.length !== 0){
            differences.push(new FileFolderDifferences(file, fileDifferences, folderDifferences));
        }
    }
    return new FileFolderDifferenceAnalysisResult(folder, differences);
}

export { 
    compareSnapshots,
    findDeviantSharing,
    findFileFolderSharingDifferences
}
