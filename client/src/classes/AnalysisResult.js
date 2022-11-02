class AnalysisResult{
    constructor(type){
        this.type = type;
    }
}

class SnapshotChangeResults extends AnalysisResult{

}

class FileFolderDifferenceAnalysisResult extends AnalysisResult{
    constructor(folder, differingFiles){
        super("file-folder-difference-analysis");
        this.folder = folder;
        this.differingFiles = differingFiles;
    }
}

class FileFolderDifferences{
    constructor(file, fileDifferences, folderDifferences){
        this.file = file;
        this.fileDifferences = fileDifferences;
        this.folderDifferences = folderDifferences;
    }
}

class DeviantAnalysisResult extends AnalysisResult{
    constructor(parent, majority, deviants){
        super("deviant-analysis");
        this.parent = parent;
        this.majority = majority;//permission set held by majority of files
        this.deviants = deviants;//list of files that dont follow this permision set
    }
}

module.exports = {
    AnalysisResult,
    SnapshotChangeResults,
    FileFolderDifferenceAnalysisResult,
    DeviantAnalysisResult,
    FileFolderDifferences
}
