export const routeVariants = {
    initial: {
        y: '0vh'
    },
    final: {
        y: '40vh'
    }
}


export const productsAnimation = {
    initial: {
        opacity: 0
    },
    whileInView: {
        opacity: 1
    },
    viewport: {
        once: true
    }
}

export const messegeBoxVariants = {
    hidden: {
        x: '100vw', opacity: 0
    },
    visible: {
        x: 0, opacity: 1
    },
    exit: {
        x: '100vh', opacity: 0
    }
}