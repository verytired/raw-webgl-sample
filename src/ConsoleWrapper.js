
//imports/ConsoleWrapper.js
class ConsoleWrapper{
    constructor(debug = false){
        this.name = 'Console wrapper!';
    }
    speak(str){
        debugger;
        console.log("Hello, I am ", str); //this == the object instance.
    }
}

module.exports = ConsoleWrapper; //set what can be imported from this file
