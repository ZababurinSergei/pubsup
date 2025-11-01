import './components/chat-manager/index.mjs'
import './components/chat-interface/index.mjs'
import './components/group-manager/index.mjs'
import './components/peer-connection/index.mjs'
import './components/screen-share-manager/index.mjs'

import {test} from './components/tests/src/index.mjs'

window.onload = async function () {
    test({
        path: '/tests/index.mjs'
    }).catch(e => {console.log('error devtool', e)})
}