class Matrix {
  constructor(m,n){
    this.m = m
    this.n = n ? n : m
    this.matrix = []
    for (let row =0; row < this.m; row++){
      const row = []
      for (let col = 0; col < this.n; col++){
        row.push(0)
      }
      this.matrix.push(row)
    }
    // console.log(`${this.m}x${this.n} Matrix`)
    return this.matrix
  }
}
