'use babel';

import AtomLuaviewView    from './thera-luaview-view';
import LuaviewServer from './thera-luaview-server';
import { CompositeDisposable } from 'atom';
import defaultTemplate from './defaultTemplate';

export default {

  atomLuaviewView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomLuaviewView = new AtomLuaviewView(state.atomLuaviewViewState);
    this.luaviewServer = new LuaviewServer();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomLuaviewView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('thera-workspace', {
      'thera-luaview:toggle': () => this.toggle(),
      'thera-luaview:nextStep': () => this.nextStep(),
      'thera-luaview:nextLine': () => this.nextLine(),
      'thera-luaview:nextBreakPoint': () => this.nextBreakPoint(),
      'thera-luaview:setupDebugServer': () => this.setupDebugServer(),
      'thera-luaview:closeDebugServer': () => this.closeDebugServer(),
      'thera-luaview:setBreakpoint': () => this.setBreakpoint(),
      'thera-luaview:removeBreakpoint': () => this.removeBreakpoint(),
    }));
    // this.luaviewServer.setupDebugServer();
    // atom.commands.add(atom.commands.rootNode, 'thera-live-server:debug', () => this.debug);
    atom.commands.add(atom.commands.rootNode, 'thera-live-server:start', () => this.start() );
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomLuaviewView.destroy();
    this.luaviewServer.closeDebugServer();
  },

  serialize() {
    return {
      atomLuaviewViewState: this.atomLuaviewView.serialize()
    };
  },

  toggle() {
    console.log('AtomLuaview was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide():
      this.modalPanel.show()
    );
  },
  nextStep(){
    this.luaviewServer.nextStep();
  },
  nextLine(){
    this.luaviewServer.nextLine();
  },
  nextBreakPoint(){
    this.luaviewServer.nextBreakPoint();
  },
  setupDebugServer() {
    this.luaviewServer.setupDebugServer();
  },
  closeDebugServer() {
    this.luaviewServer.closeDebugServer();
  },

  getCursorInfo(){
    let editor = null;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let position = editor.getCursorBufferPosition()
      if( position ) {
        let info  = {};
        info.fileName = editor.getPath();
        info.row =  position.row+1;
        return info;
      }
    }
    return null;
  },

  setBreakpoint(){
    let info = this.getCursorInfo();
    if( info ) {
      this.luaviewServer.log("设置断点: " + info.fileName + ":" +info.row);
      this.luaviewServer.setBreakpoint(info.fileName, info.row);
    }
  },
  removeBreakpoint(){
    let info = this.getCursorInfo();
    if( info ) {
      this.luaviewServer.log("删除断点: " + info.fileName + ":" +info.row);
      this.luaviewServer.removeBreakpoint(info.fileName, info.row);
    }
  },

  provideDebugService () {
    return this.luaviewServer;
  },

  provideProjectTemplate () {
    return defaultTemplate;
  },

  start(){
    atom.commands.dispatch(
      atom.views.getView(atom.workspace), 'thera-live-server:debug', );
  }
};
