class Listener {
    constructor(signal, callback, scope, args) {
        this.callback = callback;
        this.scope = scope;
        this.args = args;
        this.once = false;
        this.executed = false;//ensure a "once" signal is not executed twice
    }

    exec(args) {
        this.callback.apply(this.scope, [...args, ...this.args]);
    }
}

export default class Signal {
    constructor() {
        this.listeners = [];
    }

    /*
      add the listener only if there isn't one for callback + scope
      args are not considered because we rarely listen to the same signal with different params
     */
    add(callback, scope, ...args) {
        if(callback === undefined){
            throw new Error("no callback specified");
        }

        //check existing, doesn't consider arguments
        const n = this.listeners.length;
        for(let i = 0; i < n; i++){
            const listener = this.listeners[i];
            if(listener.callback === callback && listener.scope === scope){
                return listener;
            }
        }

        const listener = new Listener(this, callback, scope, Array.from(args));
        this.listeners.push(listener);
        return listener;
    }

    addOnce(callback, scope, ...args) {
        const listener = this.add(callback, scope, ...args);
        listener.once = true;
        return listener;
    }

    remove(callback, scope) {
        const n = this.listeners.length;
        for(let i = 0; i < n; i++) {
            const listener = this.listeners[i];
            if(listener.callback == callback && listener.scope == scope) {
                this.listeners.splice(i, 1);
                return;
            }
        }
    }

    listenEvt(target, evtName){
        const bind = this.dispatch.bind(this);
        target.addEventListener(evtName, bind);
        return {target, evtName, func:bind};
    }

    unlistenEvt(bind){
        bind.target.removeEventListener(bind.evtName, bind.func);
    }

    dispatch() {
        const args = Array.prototype.slice.call(arguments);
        for(let i = 0, ii = this.listeners.length; i < ii; i++){
            const listener = this.listeners[i];
            //undefined allows deletion of "onces"
            if(listener === undefined){
                continue;
            }
            if(listener.once) {
                this.listeners[i] = undefined;
            }
            listener.exec(args);
        }

        //splice works better with reversed loops
        let i = this.listeners.length;
        while(i--){
            if(this.listeners[i] === undefined){
                this.listeners.splice(i, 1);
            }
        }
    }

    dispose() {
        this.listeners = [];
    }
}
