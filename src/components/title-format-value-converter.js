export class TitleFormatValueConverter {

    toView(name) {
      return name.replace(/\./g, ' ');
    }
}
