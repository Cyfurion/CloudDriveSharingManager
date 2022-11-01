import { DeviantAnalysisResult } from "../classes/AnalysisResult";

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
    return new DeviantAnalysisResult(folder, majority, deviantFiles);
}

function findFileFolderSharingDifferences(){//TODO: parameters

}

export { 
    compareSnapshots,
    findDeviantSharing,
    findFileFolderSharingDifferences
}
