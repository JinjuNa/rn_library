import { createStore } from 'redux'

// mode : local , server
// pass.smartg.kr 
// admin.smartg.kr
// api.smartg.kr (최종)

const INITIAL_STATE = {
  data: {
    url     : "",      
    mode    : "server",
    local   : "http://192.168.76.23:80",   
    server  : "https://api.smartg.kr",
    sid     : "smartgym",    
    cid     : "CID00000005",
    name    : "두써킷 라이브",
    debug_beacon_local   : "N",
    dubug_beacon_uuid: "0b2b0848-205f-11e9-ab14-820316983006",
    debug_beacon_distance : "N",
    debug_beacon_console : "N",
    debug_door : "33",
    app_version : "1.0.7",
    store_id_android: "com.smartfitkorea.dolive",
    store_id_ios : "1541099596",
    iamport:"iamport",
    // tier_code:"G02"    
  }
}

function fetch(state = INITIAL_STATE, action) {
  if(action.type==='GET' && action.name==="URL") {
    //   state.data.count =   state.data.count +1;
    if(state.data.mode === "local"){
        state.data.url = state.data.local
    }
    if(state.data.mode === "server"){
        state.data.url = state.data.server
    }
  }
    //   console.log( 'count=',state.data.count);
    //   console.log( 'name=',action.name );

  return state;
}

const store = createStore(fetch)
export default store