export const isEmpty = (string) => {
    if (string == null || string === '' || string.length < 8) {
        return true
    }
    return false
}


export const colorIdentifier = (rank, colors) => {
    let percentage = (rank % 1)
    const shades = {
        r: 0,
        g: 0,
        b: 0
    }
    if (rank <= 3) {
        shades.r = 255
        shades.g = 0
        shades.b = 0
    } else if (rank > 3 && rank < 4) {
        shades.r = Math.round(colors.lowRank.red + (colors.midRank.red - colors.lowRank.red) * percentage)
        shades.g = Math.round(colors.lowRank.green + (colors.midRank.green - colors.lowRank.green) * percentage)
        shades.b = Math.round(colors.lowRank.blue + (colors.midRank.blue - colors.lowRank.blue) * percentage)

    } else if (rank === 4) {
        shades.r = 255
        shades.g = 255
        shades.b = 0
    }
    else if (rank > 4 && rank < 5) {
        shades.r = Math.round(colors.midRank.red + (colors.highRank.red - colors.midRank.red) * percentage)
        shades.g = Math.round(colors.midRank.green + (colors.highRank.green - colors.midRank.green) * percentage)
        shades.b = Math.round(colors.midRank.blue + (colors.highRank.blue - colors.midRank.blue) * percentage)
    } else if (rank === 5) {
        shades.r = 0
        shades.g = 255
        shades.b = 0
    }

    return `rgb(${shades.r}, ${shades.g}, ${shades.b})`
}

export const makeFirstUpper = (string) => {
    if (string.length <= 1) {
        return string
    }

    return string.charAt(0).toUpperCase() + string.slice(1)
}


export const makeStringShorter = (string, maxLength) => {
    if (string.length > maxLength) {
        return string.substring(0, maxLength) + "..."
    }
    return string
}