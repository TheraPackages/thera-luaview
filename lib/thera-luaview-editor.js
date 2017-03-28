'use babel';


export default class AtomLuaviewEditor {

  constructor(atomLuaviewServer) {
    this.dic_name2file = null;
    this.rootPath = null;
    this.atomLuaviewServer = atomLuaviewServer;
    this.longName2shortName = {};

    this.breakPoints = {};

    this.isStandGrammar = true;

    let atomLuaviewEditor = this;
    atom.workspace.observeTextEditors(function (editor) {
      // editor.setCursorBufferPosition( [row-1,column], {autoscroll:true} );
      // 调到指定的行
      if( !editor.luaviewTextEditorListener ) {
        editor.luaviewTextEditorListener = true;
        editor.onDidChangeSelectionRange(function(event) {
          let text = event.selection.getText();
          if( text ) {
            text = text.trim();
            if( text.length>0 ){
              atomLuaviewEditor.atomLuaviewServer.printValue(text);
            }
          }
        });
      }
    });
  }

  serialize() {}

  destroy() {
  }

  traversingPath(dic, f ){
    let longName = f.getPath();
    let index = longName.indexOf("/.");
    if( index<0 ) {
      if( f.isFile() ) {
        let idx = longName.lastIndexOf("/");
        if( idx>0 ) {
          let shortName = longName.substring(idx+1, longName.length);
          let relativeName = this.longName2relativeName(longName);
          dic[shortName] = f;
          dic[longName] = f;
          dic[relativeName] = f;
          this.longName2shortName[longName] = shortName;
          //console.log( shortName + " : " + longName );
        }
      } else if( f.isDirectory() ){
        let fileArr = f.getEntriesSync()
        for( var i=0; i<fileArr.length; i++) {
          let tempFile = fileArr[i];
          this.traversingPath(dic, tempFile );
        }
      }
    }
  }

  createName2fileDic(){
    var dic = {};
    let arr = atom.project.getDirectories();
    for( var i=0; i<arr.length; i++ ) {
      let directory = arr[i];
      //console.log( "###Traversing Path: " + directory.getPath() );
      if( this.rootPath == null ) {
        this.rootPath = directory.getPath();
      }
      this.traversingPath(dic, directory);
    }
    return dic;
  }

  name2file(name){
    if( this.dic_name2file==null ) {
      this.dic_name2file = this.createName2fileDic();
    }

    let file = this.dic_name2file[name];
    return file;
  }

  hashLongName2shortName(name){
    this.name2file("temp");
    return this.longName2shortName[name];
  }


  longName2relativeName(name){
    return name.substring(this.rootPath.length+1, name.length);
  }

  getRootPath(){
    this.name2file("temp");
    return this.rootPath;
  }

  checkIsStandGrammar(){
    let arr = atom.project.getDirectories();
    if( arr.length>0 ) {
      let self = this;
      const fs = require('fs');
      const rr = fs.createReadStream( arr[0].getPath() + '/package.json');
      rr.on('data', function(chunk){
            function toJson(str){
              var json = (new Function("return " + str))();
              return json;
            }

            let s = chunk.toString();
            let object = toJson(s);
            console.log(object);
            if( object && object.grammar!=null && object.grammar!='stand' ) {
              self.isStandGrammar = false;
            } else {
              self.isStandGrammar = true;
            }
          }
      );
    }
  }

  setBreakpoint(key,value){
    this.breakPoints[key] = value;
  }
  
}
