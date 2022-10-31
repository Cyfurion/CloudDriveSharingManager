class AnalysisResult{
    constructor(type){
        this.type = type;
    }
}

class SnapshotChangeResults extends AnalysisResult{

}

class FileFolderDifferenceAnalysisResult extends AnalysisResult{

}

class RedundantAnalysisResult extends AnalysisResult{

}

class DeviantAnalysisResult extends AnalysisResult{
    constructor(parent, majority, deviants){
        super("Deviant Analysis");
        this.parent = parent;
        this.majority = majority;//permission set held by majority of files
        this.deviants = deviants;//list of files that dont follow this permision set
    }
}