export function SwitchColor(percent) {
  if (percent >= 0 && percent < 20)
    return '#ff5252' //mat red
  if (percent >= 20 && percent < 40)
    return '#FF8C00' //mat orange
  if (percent >= 40 && percent < 60)
    return '#FFD700' //gold yellow
  if (percent >= 60 && percent < 80)
    return '#32CD32' //limeGreen
  return '#008000'; //mat green
}
