class Query{
    constructor(queryString, snapshot, operators){
        this.queryString = queryString;
        this.snapshot = snapshot;
        this.operators = operators;
    }
}

class InvalidQueryException extends Exception{

}

class Operator{
    constructor(value, left, right){
        this.value = value;
        this.left = left;
        this.right = right;
    }
    evaluate(){//TODO recursively evalutate tree

    }
}