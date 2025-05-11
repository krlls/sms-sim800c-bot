export function getPhoneFromClip(clip){
  return clip.match(/\+CLIP: "([^"]+)"/)[1]
}
