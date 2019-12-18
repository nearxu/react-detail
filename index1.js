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
    const dom = createdom(vdom)
    // child
    vdom.props.children.forEach(child => render(child,dom))
    container.appendChild(dom)
}

// createdom
function createdom(vdom){
    const dom = vdom.type === 'Text' ?
        document.createTextNode('')
        :
        document.createElement(vdom.type)

    // attr
    Object.keys(vdom.props).forEach(name => {
        if(name !== 'children'){
            dom[name] = vdom.props[name]
        }
    })
    return dom
}



