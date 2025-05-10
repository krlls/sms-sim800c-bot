export const protectEnv = (env, name) => {
  if (env === undefined) throw Error(`${name} не определена`)
  return env
}
