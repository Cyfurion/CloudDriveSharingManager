import { DeviantAnalysisResult, FileFolderDifferences, FileFolderDifferenceAnalysisResult } from "../classes/AnalysisResult";

function compareSnapshots(snapshot1, snapshot2){

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
                deviantFiles = deviantFiles.concat(permissionSet[1]);
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
        permission = JSON.stringify(permission);
        folderPermissionsMap.set(permission, 1);
    }
    for(let file of folder.files) {
        let permissionsMap = new Map(folderPermissionsMap);
        for(let permission of file.permissions){
            permission = JSON.stringify(permission);
            if(permissionsMap.has(permission)){
                permissionsMap.set(permission, 0);
            }else{
                permissionsMap.set(permission, -1);
            }
        }
        let folderDifferences = [...permissionsMap.entries()].filter(e => e[1] === 1).map(x => JSON.parse(x[0]));
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
