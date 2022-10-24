import maplibregl from 'maplibre-gl'

export default {
  id: 'highlight',
  type: 'custom',

  // method called when the layer is added to the map
  // https://maplibre.org/maplibre-gl-js-docs/api/properties/#styleimageinterface#onadd
  onAdd: function (map, gl) {
    // create GLSL source for vertex shader
    var vertexSource =
      '' +
      'uniform mat4 u_matrix;' +
      'attribute vec2 a_pos;' +
      'void main() {' +
      '    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);' +
      '}'

    // create GLSL source for fragment shader
    var fragmentSource = '' + 'void main() {' + '    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);' + '}'

    // create a vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertexSource)
    gl.compileShader(vertexShader)

    // create a fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fragmentSource)
    gl.compileShader(fragmentShader)

    // link the two shaders into a WebGL program
    this.program = gl.createProgram()
    gl.attachShader(this.program, vertexShader)
    gl.attachShader(this.program, fragmentShader)
    gl.linkProgram(this.program)

    this.aPos = gl.getAttribLocation(this.program, 'a_pos')

    // define vertices of the triangle to be rendered in the custom style layer
    var helsinki = maplibregl.MercatorCoordinate.fromLngLat({
      lng: 25.004,
      lat: 60.239,
    })
    var berlin = maplibregl.MercatorCoordinate.fromLngLat({
      lng: 13.403,
      lat: 52.562,
    })
    var kyiv = maplibregl.MercatorCoordinate.fromLngLat({
      lng: 30.498,
      lat: 50.541,
    })

    // create and initialize a WebGLBuffer to store vertex and color data
    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([helsinki.x, helsinki.y, berlin.x, berlin.y, kyiv.x, kyiv.y]),
      gl.STATIC_DRAW
    )
  },

  // method fired on each animation frame
  // https://maplibre.org/maplibre-gl-js-docs/api/map/#map.event:render
  render: function (gl, matrix) {
    gl.useProgram(this.program)
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'u_matrix'), false, matrix)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.enableVertexAttribArray(this.aPos)
    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)
  },
}
