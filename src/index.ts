// eslint-disable-next-line @typescript-eslint/no-unused-vars
function copyObject<T>(obj: T): T {
  return {
    ...obj,
  }
}

export class TokenExpander {
  // constructor() { }

  newHT(key: HiearchyTree['key']): HiearchyTree {
    return {
      key,
      tokens: [],
      children: [],
    }
  }

  getElevation(token: string): -1 | 0 | 1 {
    return (token.match(/:{$/) != null)
      ? 1
      : token === "}"
        ? -1
        : 0
  }

  splitToken(str: string, offset = 0): Token[] {
    return str.split(/[ \n]+/).filter(s => s).map((s, i) => ({
      token: s,
      offset: offset + i,
    }))
  }

  parseHiearchyTree(tokens: Token[], key: HiearchyTree["key"] = 0, originalOffset = 0): HiearchyTree {
    const _tokens = [...tokens]
    if (key !== 0) {
      _tokens.shift()
      _tokens.pop()
    }
    /** root node */
    const root = this.newHT(key)
    /** current hierarchy */
    let hierarchy = 0
    const childTokens: Token[] = []
    for (const token of _tokens) {
      const elevation = this.getElevation(token.token)
      if (hierarchy === 0) {
        if (elevation === 0) {
          root.tokens.push(token)
        } else if (elevation === 1) {
          childTokens.push(token)
        }
      } else {
        childTokens.push(token)
      }
      hierarchy += elevation
      if (hierarchy === 0 && elevation === -1) {
        const childKey = childTokens[0].token.match(/(.+):{$/)?.[1]
        if (childKey === undefined) throw new Error("invalid token")
        const childNode = this.parseHiearchyTree(childTokens, childKey, childTokens[0].offset)
        root.children.push(childNode)
        childTokens.splice(0, childTokens.length)
      }
    }
    return root
  }

  splitKey(tree: HiearchyTree): HiearchyTree[] {
    let trees: HiearchyTree[];
    if (tree.key === 0 || !tree.key.includes("*")) {
      trees = [tree]
    } else {
      const keys = tree.key.split("*")
      trees = keys.map(key => ({
        ...tree,
        key,
      }))
    }
    return trees.map(tree => ({
      ...tree,
      children: tree.children.map(child => this.splitKey(child)).flat(),
    }))
  }

  distPrefix(tree: HiearchyTree, prefix = ""): Token[] {
    const ex: Token[] = []
    ex.push(...tree.tokens.map(token => {
      return {
        ...token,
        token: prefix + token.token,
      }
    }));
    if (tree.children.length !== 0) {
      for (const childNode of tree.children) {
        ex.push(...this.distPrefix(childNode, prefix + (
          childNode.key === 0
            ? ""
            : childNode.key === ""
              ? ""
              : childNode.key + ":"
        )));
      }
    }
    return ex
  }

  concatToken(tokens: Token[]): string {
    tokens.sort((a, b) => a.offset - b.offset);
    return tokens.map(token => token.token).join(" ")
  }

  dist(str: TemplateStringsArray, ...values: string[]): string {
    const rawValueArray: string[] = []
    for (const [i, value] of str.entries()) {
      rawValueArray.push(value)
      if (i < values.length) {
        rawValueArray.push(values[i])
      }
    }
    const rawValue = rawValueArray.join("")
    const spToken = this.splitToken(rawValue)
    const tree = this.parseHiearchyTree(spToken)
    const splitTree = this.splitKey(tree)[0]
    const distTree = this.distPrefix(splitTree)
    const cToken = this.concatToken(distTree)
    return cToken
  }
}

export function dist(str: TemplateStringsArray, ...values: string[]): string {
  return new TokenExpander().dist(str, ...values)
}

// console.log(dist`apple*:{ banana }`)
