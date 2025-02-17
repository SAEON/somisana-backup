export default ({ children }) => {
  // eslint-disable-next-line no-extend-native
  String.prototype.truncate = function (length, ending) {
    length = length || 100
    ending = ending || '...'
    if (this.length > length) return this.substring(0, length - ending.length) + ending
    else return this
  }

  // eslint-disable-next-line no-extend-native
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }

  // eslint-disable-next-line no-extend-native
  String.prototype.titleize = function () {
    return this.split(/_|\s/g)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  String.prototype.toBoolean = function () {
    return this.toLowerCase() === 'true'
  }

  return children
}
