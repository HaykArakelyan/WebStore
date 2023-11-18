import { color } from "framer-motion"

export const isEmpty = (string) => {
    if (string == null || string === '' || string.length < 8) {
        return true
    }
    return false
}


export const colorIdentifier = (rank, colors) => {
    let percentage = 0
    // let shades = {
    //     green: 0,
    //     yellow: 0,
    //     red: 0
    // }

    // if (rank <= 3) {
    //     shades.red = 255
    //     shades.yellow = Math.round(255 * (rank / 3));
    //     return `rgb(${shades.red}, ${shades.yellow}, ${shades.green})`
    // } else if (rank > 3 && rank < 4) {
    //     percentage = (rank - 3) * 100
    //     shades.red = Math.round(255 - (255 * (percentage / 100)))
    //     shades.yellow = Math.round(255 * (percentage / 100))
    //     return `rgb(${shades.red}, ${shades.yellow}, ${shades.green})`
    // } else if (rank === 4) {
    //     return `rgb(${shades.red}, ${shades.yellow}, ${shades.green})`
    // } else if (rank > 4 && rank < 5) {
    //     percentage = (rank - 4) * 100
    //     shades.green = Math.round(255 * (percentage / 100))
    //     shades.yellow = Math.round(255 - (255 * (percentage / 100)))
    //     return `rgb(${shades.red}, ${shades.yellow}, ${shades.green})`
    // } else if (rank === 5) {
    //     return `rgb(${shades.red}, ${shades.yellow}, ${shades.green})`
    // }


    let red = 0;
    let green = 0;
    let blue = 0;

    // if (rank <= 3) {
    //     red = Math.round(255 * (rank / 3));
    // } else if (rank > 3 && rank < 4) {
    //     red = 255;
    //     green = Math.round(255 * (4 - rank));
    // } else if (rank === 4) {
    //     green = 255;
    // } else if (rank > 4 && rank < 5) {
    //     green = 255;
    //     blue = Math.round(255 * (rank - 4));
    // } else if (rank >= 5) {
    //     green = Math.round(255 - (255 * (rank - 5)));
    //     blue = 255;
    // }

    if (rank <= 3) {
        red = 255;
    } else if (rank > 3 && rank < 4) {
        red = 255;
        green = Math.round(255 * (4 - rank));
    } else if (rank === 4) {
        green = 255;
    } else if (rank > 4 && rank < 5) {
        green = 255;
        blue = Math.round(255 * (rank - 4));
    } else if (rank >= 5) {
        green = Math.round(255 - (255 * (rank - 5)));
        blue = 255;
    }


    return `rgb(${red}, ${green}, ${blue})`;
}