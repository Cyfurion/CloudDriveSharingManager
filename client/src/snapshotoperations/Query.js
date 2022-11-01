import { Folder } from '../classes/file-class';
import FileSnapshot from '../classes/filesnapshot-class';

const keywords = ['drive', 'owner', 'creator', 'from', 'to', 'readable', 'writable', 
    'sharable', 'name', 'inFolder', 'folder', 'path', 'sharing',
    '-drive', '-owner', '-creator', '-from', '-to', '-readable', '-writable', 
    '-sharable', '-name', '-inFolder', '-folder', '-path', '-sharing'];

//name in quotes

export default class Query{
    constructor(queryString, snapshot){
        this.queryString = queryString;
        this.snapshot = snapshot;
        this.operators = this.parse(queryString);
    }

    evaluate(){
        return this.operators.evaluate(this.snapshot);
    }

    parse(queryString){
        let i = 0;
        let operatorStack = ['('];
        queryTraversal: while(i < queryString.length){
            if(String(queryString.charAt(i)).trim() === ''){//if whitespace, skip
                i++;
                continue;
            }
            //check if keyword with colon
            if(queryString.charAt(i) === '('){
                operatorStack.push('(');
                i++;
                continue;
            }else if(queryString.charAt(i) === ')'){
                i++;
                try{
                    this.popUntilParenthesis(operatorStack);
                    continue;
                }catch(Error){
                    throw new InvalidQueryError("Incorrectly formatted query.");
                }
            }else if(queryString.substring(i).toLowerCase().indexOf('or') === 0){
                operatorStack.push(new Operator('or'));
                i += 2;
                continue;
            }else if(queryString.substring(i).toLowerCase().indexOf('and') === 0){
                i += 3;
                continue;
            }
            for(let keyword of keywords){
                if(queryString.substring(i).toLowerCase().indexOf(keyword) === 0){
                    i+=keyword.length;
                    if(String(queryString.charAt(i)) === ':'){
                        i++;
                        while(queryString.charAt(i).trim() === ''){
                            i++;
                        }
                        let parsedWord = this.parseWord(queryString, i);
                        i = parsedWord.i;
                        operatorStack.push(new Operator(keyword, parsedWord.word));
                        continue queryTraversal;
                    }
                }
            }
            //assume it is a name
            let parsedWord = this.parseWord(queryString, i-1);
            i = parsedWord.i;
            operatorStack.push(new Operator('name', parsedWord.word)); 
        }
        this.popUntilParenthesis(operatorStack);
        if(operatorStack.length !== 1){
            throw new InvalidQueryError("Incorrectly formatted query.");
        }
        return operatorStack[0];
    }

    popUntilParenthesis(operatorStack){
        let operatorsLeft = [];
        let op = '';
        while((op = operatorStack.pop()) !== '('){//flipping operators to get first in out
            operatorsLeft.push(op);
        }
        let currentTree = undefined;
        while(true){
            if(operatorsLeft.length === 0){
                if(currentTree !== undefined){
                    operatorStack.push(currentTree);
                }
                return;
            }
            let currentOperator = operatorsLeft.pop();
            if(currentTree === undefined){
                currentTree = currentOperator;
            }else{
                if(currentOperator.operator === 'or' && !currentOperator.right && !currentOperator.left){
                    currentOperator.left = currentTree;
                    currentTree = currentOperator;
                    currentOperator = operatorsLeft.pop();
                    if(currentOperator === '('){
                        throw new InvalidQueryError();
                    }
                    currentTree.right = currentOperator;
                }else{//implied and
                    let newTree = new Operator('and', undefined, currentTree, currentOperator)
                    currentTree = newTree;
                }
            }
        }
    }

    parseWord(queryString, i){
        while(queryString.charAt(i).trim() === ''){//if whitespace, skip
            i++;
        }
        let word = "";
        if(queryString.charAt(i) === '"'){
            i++;
            try{
                while(queryString.charAt(i) !== '"' && queryString.charAt(i-1) !== '\\'){//what if "lexi\\"
                    word += queryString.charAt(i);
                    i++;
                }
            }catch(e){
                throw new InvalidQueryError("Quotations not closed");
            }
            i++;//accounting for closing ""
        }else{
            while(queryString.charAt(i).trim() !== '' && queryString.charAt(i) !== ')'){
                word += queryString.charAt(i);
                i++;
            }
        }
        return {word: word, i: i};
    }
}


class InvalidQueryError extends Error{

}

class Operator{
    constructor(operator, value, left, right){
        this.operator = operator;
        this.value = value;//null if and/or
        this.left = left;
        this.right = right;
    }
    evaluate(snapshot){
        if(!this.left && !this.right){
            switch(this.operator.toLowerCase()){
                case 'drive':
                    //find files in specified drive
                    return this.basicFieldChecker(snapshot, this.equalsQualifier, 'drive');
                case '-drive':
                    return this.basicFieldChecker(snapshot, this.notEqualsQualifier, 'drive');
                case 'owner':
                    //find files owned by specified user
                    return this.basicFieldChecker(snapshot, this.equalsQualifier, 'owner');
                case '-owner':
                    return this.basicFieldChecker(snapshot, this.notEqualsQualifier, 'owner');
                case 'creator':
                    //find files created by specified user
                    return this.basicFieldChecker(snapshot, this.equalsQualifier, 'owner');
                case '-creator':
                    //find files created by specified user
                    return this.basicFieldChecker(snapshot, this.notEqualsQualifier, 'owner');
                case 'from':
                    //find files shared by specified user
                    break;
                case 'to':
                    //find files shared directly to user (not through groups or inheritted)
                    return this.to(snapshot, this.value);
                case '-to':
                    return this.to(snapshot, this.value);
                case 'readable':
                    return this.hasAccess(snapshot, 'read', this.value);
                case '-readable':
                    return this.noAccess(snapshot, 'read', this.value);
                case 'writable':
                    //find files writable by user
                    return this.hasAccess(snapshot, 'write', this.value);
                case '-writable':
                    //find files writable by user
                    return this.noAccess(snapshot, 'write', this.value);
                case 'sharable':
                    //find files sharable by user
                    //TODO what does this mean
                    break;
                case 'name':
                    //find files whose name matches 
                    return this.basicFieldChecker(snapshot, this.matchesQualifier, 'name');

                case '-name':
                    return this.basicFieldChecker(snapshot, this.notMatchesQualifier, 'name');
                case 'infolder':
                    //returns all files in specified folder regex
                    return this.inFolder(snapshot, this.value);
                case '-infolder':
                    return this.notInFolder(snapshot, this.value);
                case 'folder':
                    //find folders whose name matches regex
                    return this.basicFieldChecker(snapshot, this.folderAndEqualsQualifier, 'name');
                case '-folder':
                    return this.basicFieldChecker(snapshot, this.folderAndNotEqualsQualifier, 'name');
                case 'path':
                    //find all files with specified path
                    return this.basicFieldChecker(snapshot, this.equalsQualifier, 'path');
                case '-path':
                    return this.basicFieldChecker(snapshot, this.notEqualsQualifier, 'path');
                case 'sharing':
                    //find files shared with anyone, none, specific users/groups/domains
                    if(this.value.toLowerCase() === "none"){
                        return this.noneSharing(snapshot);
                    }else{
                        return this.userSharing(snapshot, this.value);
                    }
                case '-sharing':
                    if(this.value.toLowerCase() === "none"){
                        return this.notNoneSharing(snapshot);
                    }else{
                        return this.notUserSharing(snapshot, this.value);
                    }
                default:
                    throw new InvalidQueryError("Unreconized operator.");
            }
        }else{
            switch(this.operator.toLowerCase()){
                case 'and':
                    let x = this.and(this.left.evaluate(snapshot), this.right.evaluate(snapshot));
                    return x;
                case 'or':
                    return this.or(this.left.evaluate(snapshot), this.right.evaluate(snapshot));
                default:
                    throw new InvalidQueryError("Unreconized operator.");
            }
        }
    }

    and(list1, list2){
        let and = [];
        let occurences = new Map();
        for(let element of list1){
            occurences.set(element, 1);
        }
        for(let element of list2){
            if(occurences.has(element)){
                and.push(element);
            }
        }
        return and;
    }

    or(list1, list2){
        let or = new Set();
        for(let element of list1){
            or.add(element);
        }
        for(let element of list2){
            or.add(element);
        }
        return Array.from(or);

    }

    equalsQualifier(file, field, value){
        return value.toLowerCase() === file[field];
    }

    notEqualsQualifier(file, field, value){
        return value.toLowerCase() !== file[field];
    }

    matchesQualifier(file, field, value){
        let regex = new RegExp(value);
        return file[field].toLowerCase().match(regex);
    }

    notMatchesQualifier(file, field, value){
        let regex = new RegExp(value);
        return !file[field].match(regex);
    }

    folderAndEqualsQualifier(file, field, value){
        return value.toLowerCase() === file[field] && file instanceof Folder;
    }

    folderAndNotEqualsQualifier(file, field, value){
        return value.toLowerCase() !== file[field] && file instanceof Folder;
    }

    basicFieldChecker(file, booleanQualifier, field){
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.basicFieldChecker(rootFile, booleanQualifier, field));
            }
        }else{
            if(booleanQualifier(file, field, this.value)){
                files.push(file);
            }
            if(file instanceof Folder){
                for(let subFile of file.files){
                    files = files.concat(this.basicFieldChecker(subFile, booleanQualifier, field));
                }
            }
        }
        return files;
    }

    inFolder(file, folderRegex){
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.inFolder(rootFile, folderRegex));
            }
        }else{
            if(file instanceof Folder && file.name.toLowerCase.match(folderRegex)){
                for(let subFile of file.files){
                    files = files.concat(this.listFromFileTree(subFile));
                }
            }else{
                if(file instanceof Folder){
                    for(let subFile of file.files){
                        files = files.concat(this.inFolder(subFile));
                    }
                }
            }
        }
        return files;
    }
    
    listFromFileTree(file){
        let files = [];
        files.push(file);
        if(file instanceof Folder){
            for(let subFiles of file.files){
                files = files.concat(this.listFromFileTree(subFiles));
            }
        }
        return files;
    }

    notInFolder(file, folderRegex){
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.notInFolder(rootFile, folderRegex));
            }
        }else{
            files.push(file);
            if(!(file instanceof Folder && file.name.toLowerCase.match(folderRegex))){
                for(let subFile of file.files){
                    files = files.concat(this.notInFolder(subFile));
                }
            }
        }
        return files;
    }

    hasAccess(file, accessType, user){//TODO user is currently strictly by email
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.hasAccess(rootFile, accessType, user));
            }
        }else{
            if(file.permissions.length === 0 && accessType == 'read'){//TODO fix to make read permissions if permissions array empty
                files.push(file);
            }
            for(let permission of file.permissions){
                if(permission.entity.toLowerCase() === user.toLowerCase() || 'anyone' === user.toLowerCase()){
                    if((accessType === 'write' && (permission.role === 'write' || permission.role === 'owner'))  
                    || accessType === 'read' ){
                        files.push(file);
                        break;
                    }
                }
            }
            if(file instanceof Folder){
                for(let subFile of file.files){
                    files = files.concat(this.hasAccess(subFile, accessType, user));
                }
            }
        }
        return files;
    }

    noAccess(file, accessType, user){//TODO user is currently strictly by email
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.noAccess(rootFile, accessType, user));
            }
        }else{
            let canPush = true;
            for(let permission of file.permissions){
                if(permission.entity.toLowerCase() === user.toLowerCase() && ((accessType === 'write' && permission.role === accessType) 
                    || accessType === 'read')){//read is lowest access level, so added by default
                    canPush = false;
                    break;
                }
            }
            if(canPush){
                files.push(file);
            }
            if(file instanceof Folder){
                for(let subFile of file.files){
                    files = files.concat(this.noAccess(subFile, accessType, user));
                }
            }
        }
        return files;
    }

    to(file, user){
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.to(rootFile, user));
            }
        }else{
            for(let permission of file.permissions){
                if(permission.entity.toLowerCase() === user.toLowerCase() && !permission.isInherited){
                    files.push(file);
                    break;
                }
            }
            if(file instanceof Folder){
                for(let subFile of file.files){
                    files = files.concat(this.to(subFile, user));
                }
            }
        }
        return files;
    }

    notTo(file, user){
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.notTo(rootFile, user));
            }
        }else{
            let canPush = true;
            for(let permission of file.permissions){
                if(permission.entity.toLowerCase() === user.toLowerCase() && !permission.isInherited){
                    canPush = false;
                    break;
                }
            }
            if(canPush){
                files.push(file);
            }
            if(file instanceof Folder){
                for(let subFile of file.files){
                    files = files.concat(this.notTo(subFile, user));
                }
            }
        }
        return files;
    }
    
    noneSharing(file){
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.noneSharing(rootFile));
            }
        }else{
            if(file.permissions === []){
                files.push(file);
            }
            if(file instanceof Folder){
                for(let subFile of file.files){
                    files = files.concat(this.noneSharing(subFile));
                }
            }
        }
        return files;
    }

    notNoneSharing(file){
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.notNoneSharing(rootFile));
            }
        }else{
            if(file.permissions !== []){
                files.push(file);
            }
            if(file instanceof Folder){
                for(let subFile of file.files){
                    files = files.concat(this.notNoneSharing(subFile));
                }
            }
        }
        return files;
    }

    userSharing(file, user){//TODO special case: searching for user who is logged in
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.userSharing(rootFile, user));
            }
        }else{
            for(let permission of file.permissions){
                if(permission.entity.toLowerCase() === user.toLowerCase()){
                    files.push(file);
                    break;
                }
            }
            if(file instanceof Folder){
                for(let subFile of file.files){
                    files = files.concat(this.userSharing(subFile, user));
                }
            }
        }
        return files;
    }

    notUserSharing(file, user){//TODO special case: searching for user who is logged in
        let files = [];
        if(file instanceof FileSnapshot){
            for(let rootFile of file.root.files){
                files = files.concat(this.notUserSharing(rootFile, user));
            }
        }else{
            let canPush = true;
            for(let permission of file.permissions){
                if(permission.entity.toLowerCase() === user.toLowerCase()){
                    canPush = false;
                    break;
                }
            }
            if(canPush){
                files.push(file);
            }
            if(file instanceof Folder){
                for(let subFile of file.files){
                    files = files.concat(this.notUserSharing(subFile, user));
                }
            }
        }
        return files;
    }
}
