
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getReadingTime(blogPost) {
    const avgReaderWordPerMinute = 225
    const totalWords = blogPost.trim().split(/\s+/).length
    return Math.ceil(totalWords / avgReaderWordPerMinute)
}

module.exports = {
    isValidEmail,
    getReadingTime,
}