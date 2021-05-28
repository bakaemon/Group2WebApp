module.exports = {
    /**
     * Remove duplicates from array
     * @param {Array} array 
     */
    unique: (array) => {
        return array.filter((v, i, a)=>a.indexOf(v) == i);
    }
}