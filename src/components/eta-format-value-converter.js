export class EtaFormatValueConverter {
  toView(t) {
    return parseInt(t/86400)+'d '+(new Date(t%86400*1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s");
}
}
