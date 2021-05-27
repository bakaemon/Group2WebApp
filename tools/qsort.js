module.exports = {
    /**
     * Quicksort algorithm implementation. Faster than vanilla Array.sort built-in.
     * @param {Array} array 
     * ```js
     * var sorted_array = Object.qsort(unsorted_array)
     * ```
     */
    qsort: function quicksort(array) {
        if (array.length <= 1) {
          return array;
        }
      
        var pivot = array[0];
        
        var left = []; 
        var right = [];
      
        for (var i = 1; i < array.length; i++) {
          array[i] < pivot ? left.push(array[i]) : right.push(array[i]);
        }
      
        return quicksort(left).concat(pivot, quicksort(right));
      }
}