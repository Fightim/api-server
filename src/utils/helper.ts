export function undefineToNull(prop: any | undefined) {
  if (prop == undefined) return null;
  else return prop;
}
