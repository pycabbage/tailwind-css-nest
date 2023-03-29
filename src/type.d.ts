
interface Token {
  token: string;
  offset: number;
}

interface HiearchyTree {
  key: 0 | string,
  tokens: Token[],
  children: HiearchyTree[],
}
