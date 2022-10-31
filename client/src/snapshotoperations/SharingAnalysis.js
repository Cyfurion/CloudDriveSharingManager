const deviantThreshhold = .6;

function compareSnapshots(snapshot1, snapshot2){

}

function findRedundantSharing(snapshot){

}

/**
 * Deviant analysis. Limitations: threshold must be above .5.
 * @param folder folder whose files to perform analysis on
 * @returns results of deviant analysis.
 */
function findDeviantSharing(folder){
    let permissionsMap = new Map();
    for(let file of folder.files){
        let permissionSet = file.permissions;
        if(permissionsMap.has(permissionSet)){
            permissionsMap.set(permissionSet, permissionsMap.get(permissionSet) + 1);
        } else {
            permissionsMap.set(permissionSet, 1);
        }
    }
    let majority = [...permissionsMap.entries()].reduce((a, e ) => e[1] > a[1] ? e : a);//count of majority

    let deviantPermissions = [];
    if(majority / folder.files.length >= threshold){
        for(permissionSet of permissionsMap.entries()){
            if(permissionsMap.get(permissionSet) != majority){
                deviantPermissions.push(permissionSet);
            }
        }
    }
    return new DeviantAnalysisResult(folder, majority, deviantPermissions);
    // TODO majority is either frequency or permission set itself
}

function findFileFolderSharingDifferences(){//TODO: parameters

}
