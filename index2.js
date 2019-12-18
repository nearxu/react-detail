// create vdom 
function createElement(type,props,...children){
    // delete props.__source
    return {
        type,
        props:{
            ...props,
            children:children.map(child => 
                typeof child === 'object' ?
                child 
                :
                createElementText(child))
        }
    }
}

function createElementText(text){
    return {
        type:'Text',
        props:{
            nodeValue:text,
            children:[]
        }
    }
}



// render
function render(vdom,container){
    // container.innerHTML = `<pre>${JSON.stringify(vdom,null,2)}</pre>`
    const dom = createdom(vdom)
    nextWork = {
        dom:container,
        props:{
            children:[vdom]
        }
    }

    // child
    vdom.props && vdom.props.children.forEach(child => render(child,dom))

    console.log(dom,'dom')
    container.appendChild(dom)
}

// createdom
function createdom(vdom){
    const dom = vdom.type === 'Text' ?
        document.createTextNode('')
        :
        document.createElement(vdom.type)

    // attr
    // Object.keys(vdom.props).forEach(name => {
    //     if(name !== 'children'){
    //         dom[name] = vdom.props[name]
    //     }
    // })
    return dom
}

// reauestIdleCallback

let nextWork = null

function workLoop(deadline){
    while(nextWork && deadline.timeRemainimg() > 1){
        nextWork = performWork(nextWork)
    }
    requestIdleCallback(workLoop)
}

function performWork(fiber){
    if(!fiber.dom){
        fiber.dom = createdom(fiber)
    }

    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }
    const elements = fiber.props.children

    let index = 0;
    let preSibling = null
    while(index < elements.length){
        let element = elements[index]
        const newFiber = {
            type:element.type,
            props:element.props,
            parent:fiber,
            dom:null
        }
        if(index === 0){
            fiber.child = newFiber
        }else {
            preSibling.sibling = fiber
        }
        preSibling = fiber
        index++
    }
    if(fiber.child){
        return fiber.child
    }

    let nextFiber = fiber
    // 没有子元素，就找兄弟元素
    while (nextFiber) {
        if (nextFiber.sibling) {
        return nextFiber.sibling
        }
        // 没有兄弟元素，找父元素
        nextFiber = nextFiber.parent
    }

}

function requestIdleCallback(){}


