function capitalizeFirst(word) {
    word = word.toLowerCase();
    return word[0].toUpperCase() + word.slice(1);
}

module.exports = {
    capitalizeFirst
};