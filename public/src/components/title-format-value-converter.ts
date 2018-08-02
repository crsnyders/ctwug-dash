export class TitleFormatValueConverter {

    toView(name: string) {
      return name.replace(/\./g, ' ');
    }
}
