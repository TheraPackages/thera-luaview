'use babel';

const {DebugService, Breakpoint, CallFrame} = require('thera-debug-common-types')
const {COMMAND,
  CallStackPayload,
  ResolveBreakpointPayload,
  UpdateScopePayload,
  StartedPayload,
  StoppedPayload} = require('thera-debug-common-types').Payload
const {RemoteObject, PropertyDescriptor} = require('thera-debug-common-types').Scope


let HOST = '127.0.0.1';
let PORT = 9987; // Luaview调试服务监听接口

import AtomLuaviewEditor from './thera-luaview-editor';

export default class AtomLuaviewServer  extends DebugService {

  constructor() {
    super();
    this.socket = null;
    this.server = null;
    this.atomLuaviewEditor = new AtomLuaviewEditor(this);
    this.buffer = null;
    this.breakPointInited = false;

    this.name = 'luaview';

    this.stackInfo = null;
  }

  serialize() {}

  destroy() {
  }

  sendCmd(s){
    if( this.socket ) {
      let len = Buffer.byteLength(s,'utf8');
      let buf = Buffer.alloc(len + 4);
      buf.writeInt32BE(len,0);
      buf.write(s,4,len,'utf8');
      this.socket.write(buf);
    }
  }

  resume(){
    this.runContinue();
  }
  runContinue(){
    this.sendCmd("c");
  }
  stepOver(){
    this.sendCmd("n");
  }
  stepInto(){
    this.sendCmd("s");
  }
  stepOut(){
    this.runContinue();
  }
  stop(){
    console.log('LuaView Stop');
  }
  nextStep(){
    this.stepInto();
  }
  nextLine(){
    this.stepOver();
  }
  nextBreakPoint(){
    this.runContinue();
  }

  split2Lines(str){
    let lines = str.split('\n');
    for( var i=0; i<lines.length; i++ ) {
      if( lines[i]=="" ) {
        let arr0 = lines.slice(0, i+1);
        let arr2 = lines.slice(i+1, lines.length);
        let content = arr2.join('\n');
        arr0[i] = "Content:" + content;
        return arr0;
      }
    }
    return lines;
  }

  addData(newData){
    if( this.buffer ){
      if( newData ) {
        let oldData = this.buffer;
        let totalLen = oldData.length + newData.length;
        let totalBuf = Buffer.alloc(totalLen);
        oldData.copy( totalBuf, 0,              0, oldData.length );
        newData.copy( totalBuf, oldData.length, 0, newData.length );
        this.buffer = totalBuf;
      }
    } else {
      this.buffer = newData;
    }
  }

  getOneCmdData(){
    let buf = this.buffer;
    if( buf && buf.length>4 ) {
        let i = 0;
        let len = buf.readInt32BE(i) + 4;
        let endLen = buf.length-len;
        if( len<=buf.length ) {
          let newbuf = Buffer.alloc(len);
          buf.copy( newbuf, 0, i, i+len );

          if( endLen>0 ) {
            let endBuf = Buffer.alloc(endLen);
            buf.copy( endBuf, 0, len, buf.length);
            this.buffer = endBuf;
          } else {
            this.buffer = null;
          }
          return newbuf;
        }
    }
    return null;
  }

  cmdData2dictionary(buf){
    let len = buf.readInt32BE(0);
    let str = buf.toString('utf8',4,len+4);
    let lines = this.split2Lines(str);
    let args = {};
    for( var i=0; i<lines.length; i++ ) {
      let line = lines[i];
      if ( line.length>0 ) {
        let index = line.indexOf(":");
        if( index>0 ){
            let k = line.substring(0,             index).trim();
            let v = line.substring(index+1, line.length).trim();
            args[k] = v;
        }
      } else {
        break;
      }
    }
    return args;
  }

  error(content){
    atom.commands.dispatch(
      atom.views.getView(atom.workspace),
      "console:log",
      {first: () => content, last: () => 'error'}
    );
  }


  log(content){
    atom.commands.dispatch(
      atom.views.getView(atom.workspace),
      "console:log",
      {first: () => content, last: () => 'INFO'}
    );
  }

  serverLog(content){
    atom.commands.dispatch(
      atom.views.getView(atom.workspace),
      "console:server",
      {first: () => content, last: () => 'INFO'}
    );
  }

  firstTimeAddBreakPoint(){
    let breakPoints = this.atomLuaviewEditor.breakPoints;
    for (var key in breakPoints) {
      var value = breakPoints[key];
      if ( key && value ) {
        this.sendCmd( value );
      }
    }
  }

  doCmd(socketData){
    this.addData(socketData);
    for( ; ; ) {
      let oneCmdData = this.getOneCmdData();
      if( oneCmdData == null ){
        break;
      }
      let args = this.cmdData2dictionary(oneCmdData);
      let cmdName = args["Cmd-Name"];
      if( cmdName=="running" ) {
        let fileName = args["File-Name"];
        let lineNumber = args["Line-Number"];
        this.sendCmd("stack");
      } else if( cmdName=='log' ) {
        let content = args["Content"];
        if( content && content.indexOf("[LuaView][error]")>=0 ) {
          this.error(content);
        } else {
          this.log(content);
        }
      } else if( cmdName=='stack' ) {
        let content = args["Content"];
        this.setCallStack(content);

        // 首次启动模拟器需要添加以前的断点
        if( this.breakPointInited==false ) {
          this.breakPointInited = true;
          this.firstTimeAddBreakPoint();
          this.runContinue();
        }
      } else if( cmdName=='loadfile' ) {
        let fileName = args["File-Name"];
        this.sendCmd("stack");
      } else if( cmdName=='debugger' ) {
        this.sendOpenPageCmd();
      } else {
        this.log("[LuaView][Debugger] Unkown Cmd Name: " + cmdName );
      }
    }
  }

  sendOpenPageCmd(){
    let s = "jhs://go/ju/luaview?_lv_path="+this.atomLuaviewEditor.getRootPath();
    if( this.atomLuaviewEditor.isStandGrammar ) {
      // 标准语法不用带着参数
    } else {
      s += "&_lv_change_grammar=true";
    }
    this.sendCmd(' { "openUrl" :' + '"'+ s + '"}');
  }

  setupDebugServer() {
    this.closeDebugServer();
    this.log('[LuaView][Debugger] Thera plugin Server !');
    var net = require('net');

    let self = this;
    this.server = net.createServer(function(sock) {
        self.breakPointInited = false;
        self.socket = sock;
        // sock.bufferSize(1024*1024);
        self.log('[LuaView][Debugger] socket connected: ' + sock.remoteAddress + ':' + sock.remotePort);
        sock.on('data', function(buf0) {
          self.doCmd(buf0);
        });
        sock.on('close', function(data) {
            self.socket = null;
            self.log('[LuaView][Debugger] socket Close ' + sock.remoteAddress + ':' + sock.remotePort);
        });
    });
    this.server.on("error",function(){
        self.error('[LuaView][Debugger] Server listening ERROR on ' + HOST +':'+ PORT + ' (可能开了多个模拟器)');
    });
    this.server.on("close",function(){
        self.log('[LuaView][Debugger] Server unlistening on ' + HOST +':'+ PORT);
        self.stoppedPayload();
    });
    this.server.on('listening', function() {
        self.log('[LuaView][Debugger] Server listening on ' + HOST +':'+ PORT);
    });
    this.server.listen(PORT, HOST);
    this.startedPayload();
  }

  closeDebugServer(){
    if( this.server ) {
      this.server.close();
      this.server = null;
    }
  }

  setBreakpoint(fileName, lineNumber ) {
    this.addBreakpoint(fileName, lineNumber);
  }

  addBreakpoint(fileName, lineNumber) {
    if( fileName ) {
      if( !lineNumber ){
        let lines = fileName.split(':');
        if( lines.length==2 ) {
          fileName = lines[0];
          lineNumber = lines[1];
        }
      }
      // {
      //   let shortName = this.atomLuaviewEditor.hashLongName2shortName(fileName);
      //   this.sendCmd( "b " + shortName + ":" + lineNumber );
      // }
      {
        let relativeName = this.atomLuaviewEditor.longName2relativeName(fileName);
        let info = relativeName + ":" + lineNumber;
        let cmd = "b " + info;
        this.sendCmd( cmd );
        this.atomLuaviewEditor.setBreakpoint(info, cmd);
      }
    }


    // 断点反馈
    let breakpoint = new Breakpoint(fileName + ':' + lineNumber, fileName, lineNumber, true)
    let payload = new ResolveBreakpointPayload(breakpoint)
    this.paused(payload)
  }

  removeBreakpoint(fileName, lineNumber ) {
    if( fileName ) {
      if( !lineNumber ){
        let lines = fileName.split(':');
        if( lines.length==2 ) {
          fileName = lines[0];
          lineNumber = lines[1];
        }
      }
      fileName = this.atomLuaviewEditor.longName2relativeName(fileName);

      let info = fileName + ":" + lineNumber;
      let cmd = "rb " + info;
      this.sendCmd(cmd);
      this.atomLuaviewEditor.setBreakpoint(info, null);
    }
  }

  printValue(s){
    s = s.trim();
    if ( s.indexOf('.') < 0 ) {
      this.sendCmd( "p " + s );
    } else {
      this.sendCmd( 'run print("' + s + ' =" , ' + s + ')' );
    }
  }

  // debug control
  startDebug (entranceURL) {
    this.atomLuaviewEditor.name2file("test");// 只是为了创建文件映射表
    this.atomLuaviewEditor.checkIsStandGrammar();
    this.stackInfo = null;
    this.breakPointInited = false;
    this.setupDebugServer();
    console.log(`luaview startDebug on url ${entranceURL}`)
  }

  stopDebug () {
    this.closeDebugServer();
    this.stackInfo = null;
    console.log(`luaview stopDebug`)
  }

  pause () {
    console.log(`luaview pause`)
  }

  //
  getCallStack () {
    console.log(`luaview getCallStack`)
  }


  // stack traceback:
  // 	[string "demoE_Button.lua"]:12: in function 'createButton'
  // 	[string "demoE_Button.lua"]:16: in main chunk
  setCallStack (info) {
    if( this.stackInfo==info ) {
      return;
    }
    this.stackInfo = info;

    let lines = info.split('\n');
    let frames = new Array();
    var j=0;
    for( var i=0;i < lines.length; i++ ) {
      let line = lines[i];
      line = line.trim();
      let arr = line.split(':');
      if( arr.length>=3 ) {
        let frameID = ""+i;
        let fileName = arr[0].split('"')[1];
        let fileObject = this.atomLuaviewEditor.name2file(fileName);
        if( fileObject ) {
          fileName = fileObject.getPath();
        }
        let row = Number(arr[1]);
        let functionName = arr[2];
        frames[j++] = new CallFrame(frameID, functionName, row, fileName);
      }
    }
    let payload = {
      command: 'UPDATE_CALLSTACK',
      callFrames: frames,
      reason: 'breakpoint',
      hitBreakpoints: [],
      currentCallFrameId: '1'
    }
    this.payload = payload;
    this.paused(payload);
  }
  selectCallFrame (callFrameId) {
    let payload = this.payload;
    payload.currentCallFrameId = callFrameId;
    this.paused(payload)
  }

  startedPayload(){
    let payload = new StartedPayload();
    this.paused(payload);
  }

  stoppedPayload(){
    let payload = new StoppedPayload();
    this.paused(payload);
  }

  syncAllBreakpoints (breakpoints) {
    for( var i=0;i<breakpoints.length; i++ ){
      let b = breakpoints[i];
      this.addBreakpoint(b.path, b.line);
    }
  }
}



  // console.log('AtomLuaview pathTest!');
  // let arr = atom.project.getPaths();
  // for( var i=0; i<arr.length; i++ ) {
  //   console.log( "path: "+ arr[i] );
  // }
  // atom.workspace.open( "./menus/thera-luaview.json" );
