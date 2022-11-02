import { Folder } from '../classes/file-class';
import FileSnapshot from '../classes/filesnapshot-class';

const keywords = ['drive', 'owner', 'creator', 'from', 'to', 'readable', 'writable', 
    'sharable', 'name', 'inFolder', 'folder', 'path', 'sharing',
    '-drive', '-owner', '-creator', '-from', '-to', '-readable', '-writable', 
    '-sharable', '-name', '-inFolder', '-folder', '-path', '-sharing'];

//name in quotes

export default class Query {
    constructor(queryString, snapshot) {
        this.queryString = queryString;
        this.snapshot = snapshot;
        this.operators = this.parse(queryString);
    }

    evaluate() {
        return this.operators.evaluate(this.snapshot);
    }

    parse(queryString) {
        let i = 0;
        let operatorStack = ['('];
        queryTraversal: while(i < queryString.length) {
            if (String(queryString.charAt(i)).trim() === '') { // if whitespace, skip
                i++;
                continue;
            }
            // check if keyword with colon
            if (queryString.charAt(i) === '(') {
                operatorStack.push('(');
                i++;
                continue;
            } else if (queryString.charAt(i) === ')') {
                i++;
                try {
                    this.popUntilParenthesis(operatorStack);
                    continue;
                } catch (e) {
                    throw new InvalidQueryError("Incorrectly formatted query.");
                }
            } else if (queryString.substring(i).indexOf('or') === 0) {
                operatorStack.push(new Operator('or'));
                i += 2;
                continue;
            } else if (queryString.substring(i).indexOf('and') === 0) {
                i += 3;
                continue;
            }
            for (let keyword of keywords) {
                if (queryString.substring(i).indexOf(keyword) === 0) {
                    i += keyword.length;
                    if (String(queryString.charAt(i)) === ':') {
                        i++;
                        while (queryString.charAt(i).trim() === '') {
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
            let parsedWord = this.parseWord(queryString, i - 1);
            i = parsedWord.i;
            operatorStack.push(new Operator('name', parsedWord.word)); 
        }
        this.popUntilParenthesis(operatorStack);
        if (operatorStack.length !== 1) {
            throw new InvalidQueryError("Incorrectly formatted query.");
        }
        return operatorStack[0];
    }

    popUntilParenthesis(operatorStack) {
        let operatorsLeft = [];
        let op = '';
        while ((op = operatorStack.pop()) !== '(') {//flipping operators to get first in out
            operatorsLeft.push(op);
        }
        let currentTree = undefined;
        while (true) {
            if (operatorsLeft.length === 0) {
                if (currentTree !== undefined) {
                    operatorStack.push(currentTree);
                }
                return;
            }
            let currentOperator = operatorsLeft.pop();
            if (currentTree === undefined) {
                currentTree = currentOperator;
            } else {
                if (currentOperator.operator === 'or' && !currentOperator.right && !currentOperator.left) {
                    currentOperator.left = currentTree;
                    currentTree = currentOperator;
                    currentOperator = operatorsLeft.pop();
                    if (currentOperator === '(') {
                        throw new InvalidQueryError();
                    }
                    currentTree.right = currentOperator;
                } else { //implied and
                    let newTree = new Operator('and', undefined, currentTree, currentOperator)
                    currentTree = newTree;
                }
            }
        }
    }

    parseWord(queryString, i) {
        while (queryString.charAt(i).trim() === '') { // if whitespace, skip
            i++;
        }
        let word = "";
        if (queryString.charAt(i) === '"') {
            i++;
            try {
                while (queryString.charAt(i) !== '"' && queryString.charAt(i-1) !== '\\') { //what if "lexi\\"
                    word += queryString.charAt(i);
                    i++;
                }
            } catch(e) {
                throw new InvalidQueryError("Quotations not closed");
            }
            i++; // accounting for closing ""
        } else {
            while (queryString.charAt(i).trim() !== '' && queryString.charAt(i) !== ')') {
                word += queryString.charAt(i);
                i++;
            }
        }
        return {word: word, i: i};
    }
}


class InvalidQueryError extends Error {

}

class Operator {
    constructor(operator, value, left, right) {
        this.operator = operator;
        this.value = value; // null if and/or
        this.left = left;
        this.right = right;
    }

    evaluate(snapshot) {
        if (!this.left && !this.right) {
            switch (this.operator.toLowerCase()) {
                case 'drive':
                    // find files in specified drive
                    return this.basicFieldChecker(snapshot, this.driveQualifier, 'drive');
                case '-drive':
                    return this.basicFieldChecker(snapshot, this.notDriveQualifier, 'drive');
                case 'owner':
                    // find files owned by specified user
                    return this.basicFieldChecker(snapshot, this.equalsQualifier, 'owner');
                case '-owner':
                    return this.basicFieldChecker(snapshot, this.notEqualsQualifier, 'owner');
                case 'creator':
                    // find files created by specified user
                    return this.basicFieldChecker(snapshot, this.equalsQualifier, 'owner');
                case '-creator':
                    // find files created by specified user
                    return this.basicFieldChecker(snapshot, this.notEqualsQualifier, 'owner');
                case 'from':
                    //find files shared by specified user
                    throw new Error("from keyword is not yet implemented");
                case 'to':
                    // find files shared directly to user (not through groups or inheritted)
                    return this.to(snapshot, this.value);
                case '-to':
                    return this.notTo(snapshot, this.value);
                case 'readable':
                    return this.hasAccess(snapshot, 'read', this.value);
                case '-readable':
                    return this.noAccess(snapshot, 'read', this.value);
                case 'writable':
                    // find files writable by user
                    return this.hasAccess(snapshot, 'write', this.value);
                case '-writable':
                    // find files writable by user
                    return this.noAccess(snapshot, 'write', this.value);
                case 'sharable':
                    // find files sharable by user
                    throw new Error("sharable keyword is not yet implemented");
                case 'name':
                    // find files whose name matches 
                    return this.basicFieldChecker(snapshot, this.matchesQualifier, 'name');
                case '-name':
                    return this.basicFieldChecker(snapshot, this.notMatchesQualifier, 'name');
                case 'infolder':
                    // returns all files in specified folder regex
                    return this.inFolder(snapshot, this.value);
                case '-infolder':
                    return this.notInFolder(snapshot, this.value);
                case 'folder':
                    // find folders whose name matches regex
                    return this.basicFieldChecker(snapshot, this.folderAndEqualsQualifier, 'name');
                case '-folder':
                    return this.basicFieldChecker(snapshot, this.folderAndNotEqualsQualifier, 'name');
                case 'path':
                    // find all files with specified path
                    return this.basicFieldChecker(snapshot, this.pathQualifier, 'path');
                case '-path':
                    return this.basicFieldChecker(snapshot, this.notPathQualifier, 'path');
                case 'sharing':
                    //find files shared with anyone, none, specific users/groups/domains
                    if (this.value.toLowerCase() === "none") {
                        return this.noneSharing(snapshot, snapshot.profile[0]);
                    } else {
                        return this.userSharing(snapshot, this.value);
                    }
                case '-sharing':
                    if (this.value.toLowerCase() === "none") {
                        return this.notNoneSharing(snapshot);
                    } else {
                        return this.notUserSharing(snapshot, this.value);
                    }
                default:
                    throw new InvalidQueryError("Unrecognized operator.");
            }
        } else {
            switch (this.operator.toLowerCase()) {
                case 'and':
                    let x = this.and(this.left.evaluate(snapshot), this.right.evaluate(snapshot));
                    return x;
                case 'or':
                    return this.or(this.left.evaluate(snapshot), this.right.evaluate(snapshot));
                default:
                    throw new InvalidQueryError("Unrecognized operator.");
            }
        }
    }

    and(list1, list2) {
        let and = [];
        let occurences = new Map();
        for (let element of list1) {
            occurences.set(element, 1);
        }
        for (let element of list2) {
            if (occurences.has(element)) {
                and.push(element);
            }
        }
        return and;
    }

    or(list1, list2) {
        let or = new Set();
        for (let element of list1) {
            or.add(element);
        }
        for (let element of list2) {
            or.add(element);
        }
        return Array.from(or);

    }

    equalsQualifier(file, field, value) {
        return value.toLowerCase() === file[field].toLowerCase();
    }
    notEqualsQualifier(file, field, value) {
        return value.toLowerCase() !== file[field].toLowerCase();
    }

    driveQualifier(file, field, value) {
        return (value === "MyDrive" && file[field] === "") || value === file[field]
    }
    notDriveQualifier(file, field, value) {
        return !((value === "MyDrive" && file[field] === "") || value === file[field]);
    }

    pathQualifier(file, field, value) {
        return file[field].toLowerCase().indexOf(value.toLowerCase()) === 0 && file[field].charAt(value.length) === '/';
    }
    notPathQualifier(file, field, value) {
        return !(file[field].toLowerCase().indexOf(value.toLowerCase()) === 0 && file[field].charAt(value.length) === '/');
    }

    matchesQualifier(file, field, value) {
        let regex = new RegExp(value, 'i');
        return regex.test(file[field]);
    }
    notMatchesQualifier(file, field, value) {
        let regex = new RegExp(value, 'i');
        return !regex.test(file[field]);
    }

    folderAndEqualsQualifier(file, field, value) {
        return (new RegExp(value, 'i')).test(file[field]) && file instanceof Folder;
    }
    folderAndNotEqualsQualifier(file, field, value) {
        return !(new RegExp(value, 'i')).test(file[field]) && file instanceof Folder;
    }

    basicFieldChecker(file, booleanQualifier, field) {
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.basicFieldChecker(rootFile, booleanQualifier, field));
            }
        } else {
            if (booleanQualifier(file, field, this.value)) {
                files.push(file);
            }
            if (file instanceof Folder) {
                for (let subFile of file.files) {
                    files = files.concat(this.basicFieldChecker(subFile, booleanQualifier, field));
                }
            }
        }
        return files;
    }

    inFolder(file, folderRegex) {
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.inFolder(rootFile, folderRegex));
            }
        } else {
            if (file instanceof Folder && (new RegExp(folderRegex, 'i')).test(file.name)) {
                for (let subFile of file.files) {
                    files = files.concat(this.listFromFileTree(subFile));
                }
            } else {
                if (file instanceof Folder) {
                    for (let subFile of file.files) {
                        files = files.concat(this.inFolder(subFile, folderRegex));
                    }
                }
            }
        }
        return files;
    }
    notInFolder(file, folderRegex) {
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.notInFolder(rootFile, folderRegex));
            }
        } else {
            files.push(file);
            if (!(file instanceof Folder && (new RegExp(folderRegex, 'i')).test(file.name))) {
                for (let subFile of file.files) {
                    files = files.concat(this.notInFolder(subFile));
                }
            }
        }
        return files;
    }
    
    listFromFileTree(file) {
        let files = [];
        files.push(file);
        if (file instanceof Folder) {
            for (let subFiles of file.files) {
                files = files.concat(this.listFromFileTree(subFiles));
            }
        }
        return files;
    }

    hasAccess(file, accessType, user) { 
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.hasAccess(rootFile, accessType, user));
            }
        } else {
            if (file.permissions.length === 0 && accessType === 'read') { 
                files.push(file);
            }
            for (let permission of file.permissions) {
                if (permission.entity.toLowerCase() === user.toLowerCase() || 'anyone' === user.toLowerCase()) {
                    if ((accessType === 'write' && (permission.role === 'write' || permission.role === 'owner'))  
                    || accessType === 'read' ) {
                        files.push(file);
                        break;
                    }
                }
            }
            if (file instanceof Folder) {
                for (let subFile of file.files) {
                    files = files.concat(this.hasAccess(subFile, accessType, user));
                }
            }
        }
        return files;
    }
    noAccess(file, accessType, user) {
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.noAccess(rootFile, accessType, user));
            }
        } else {
            let canPush = true;
            for (let permission of file.permissions) {
                if (permission.entity.toLowerCase() === user.toLowerCase() 
                    && ((accessType === 'write' && permission.role === accessType) || accessType === 'read')) { 
                    canPush = false;
                    break;
                }
            }
            if (canPush) {
                files.push(file);
            }
            if (file instanceof Folder) {
                for (let subFile of file.files) {
                    files = files.concat(this.noAccess(subFile, accessType, user));
                }
            }
        }
        return files;
    }

    to(file, user) {
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.to(rootFile, user));
            }
        } else {
            for (let permission of file.permissions) {
                if (permission.entity.toLowerCase() === user.toLowerCase() && !permission.isInherited) {
                    files.push(file);
                    break;
                }
            }
            if (file instanceof Folder) {
                for (let subFile of file.files) {
                    files = files.concat(this.to(subFile, user));
                }
            }
        }
        return files;
    }

    notTo(file, user) {
        let files = [];
        if(file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.notTo(rootFile, user));
            }
        } else {
            let canPush = true;
            for (let permission of file.permissions) {
                if (permission.entity.toLowerCase() === user.toLowerCase() && !permission.isInherited) {
                    canPush = false;
                    break;
                }
            }
            if (canPush) {
                files.push(file);
            }
            if (file instanceof Folder) {
                for (let subFile of file.files) {
                    files = files.concat(this.notTo(subFile, user));
                }
            }
        }
        return files;
    }
    
    noneSharing(file, email) {
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.noneSharing(rootFile, email));
            }
        } else {
            if (file.permissions.length === 1) {
                if (file.permissions[0].entity === email) {
                    files.push(file);
                }
            }
            if (file instanceof Folder) {
                for (let subFile of file.files) {
                    files = files.concat(this.noneSharing(subFile, email));
                }
            }
        }
        return files;
    }

    notNoneSharing(file) {
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.notNoneSharing(rootFile));
            }
        } else {
            if (file.permissions.length !== 1) { 
                files.push(file);
            }
            if (file instanceof Folder) {
                for(let subFile of file.files) {
                    files = files.concat(this.notNoneSharing(subFile));
                }
            }
        }
        return files;
    }

    userSharing(file, user) { 
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.userSharing(rootFile, user));
            }
        } else {
            for (let permission of file.permissions) {
                if (permission.entity.toLowerCase() === user.toLowerCase()) {
                    files.push(file);
                    break;
                }
            }
            if (file instanceof Folder) {
                for (let subFile of file.files) {
                    files = files.concat(this.userSharing(subFile, user));
                }
            }
        }
        return files;
    }

    notUserSharing(file, user) {
        let files = [];
        if (file instanceof FileSnapshot) {
            for (let rootFile of file.root.files) {
                files = files.concat(this.notUserSharing(rootFile, user));
            }
        } else {
            let canPush = true;
            for (let permission of file.permissions) {
                if (permission.entity.toLowerCase() === user.toLowerCase()) {
                    canPush = false;
                    break;
                }
            }
            if (canPush) {
                files.push(file);
            }
            if (file instanceof Folder) {
                for (let subFile of file.files) {
                    files = files.concat(this.notUserSharing(subFile, user));
                }
            }
        }
        return files;
    }
}
