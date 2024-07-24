class NumberConverter {
  constructor(number) {
    this.isNegative = (number >= 0 ? false : true);
    this.number = Math.abs(number);

    this.units = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    this.teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis'];
    this.tens = ['treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    this.scaleSingle = ['millón', 'billón', 'trillón', 'cuatrillón', 'quintillón', 'sextillón', 'septillón', 'octillón', 'nonillón', 'decillón']
    this.especialCases = {
      dieci: 'dieci',
      veinte: 'veinte',
      veinti: 'veinti',
      veintidos: 'veintidós',
      veintitres: 'veintitrés',
      veintiseis: 'veintiséis',
      cien: 'cien',
      ciento: 'ciento',
      cientos: 'cientos',
      quinientos: 'quinientos',
      setecientos: 'setecientos',
      novecientos: 'novecientos',
      mil: 'mil'
    }
  }

  deleteZerosLeft(number) {
    if (number === undefined) return;
    while (number[0] === '0')
      number = number.slice(1);
    if (number === '') number = '0';
    return number
  }

  getGroup(number) {
    number = this.deleteZerosLeft(number);
    if (number.length === 1) return this.getUnit(number);
    if (number.length === 2) return this.getTens(number);
    if (number.length === 3) return this.getHundreds(number);
  }

  getUnit(number) {
    if (number === 0) return this.units[0];
    return this.units[number];
  }

  getTens(number) {
    // 10 - 16
    if (number < 17) return this.teens[number - 10];
    // 17 - 19
    if (number < 20) return this.especialCases.dieci + this.getUnit(number[1]);
    // 20 - 29
    if (number < 30) {
      switch (number) {
        case '20': return this.especialCases.veinte;
        case '22': return this.especialCases.veintidos;
        case '23': return this.especialCases.veintitres;
        case '26': return this.especialCases.veintiseis;
        default: return this.especialCases.veinti + this.getUnit(number[1]);
      }
    }
    // 30 - 99
    const tens = this.tens[number[0] - 3];
    const unit = this.getUnit(number[1]);
    return unit === this.units[0] ? tens : tens + ' y ' + unit
  }

  getHundreds(number) {
    let hundreds = this.getUnit(number[0]);
    switch (hundreds) {
      case this.units[1]: hundreds = this.especialCases.cien; break;
      case this.units[5]: hundreds = this.especialCases.quinientos; break;
      case this.units[7]: hundreds = this.especialCases.setecientos; break;
      case this.units[9]: hundreds = this.especialCases.novecientos; break;
      default: hundreds += this.especialCases.cientos; break;
    }
    if (number.slice(1) == '00') return hundreds;
    if (hundreds === this.especialCases.cien) hundreds = this.especialCases.ciento;
    if (number[1] === '0') return hundreds + ' ' + this.getUnit(number[2]);
    const tens = this.getTens(number.slice(1));
    return hundreds + (tens === this.units[0] ? '' : ' ' + tens);
  }

  splitPerThousand(number) {
    number = String(this.deleteZerosLeft(number));
    const groups = [];
    let inverter = number.split('').reverse().join('');
    while (inverter.length > 0) {
      groups.push(inverter.slice(0, 3).split('').reverse().join(''));
      inverter = inverter.slice(3)
    }
    return groups.reverse();
  }

  splitThousandsGrups(number) {
    const groups = this.splitPerThousand(number).reverse();
    const result = [];

    let supGroup = [];
    groups.forEach((item) => {
      supGroup.push(item);
      if (supGroup.length === 2) {
        result.push(supGroup.reverse());
        supGroup = [];
      }
    });
    if (supGroup.length > 0) result.push(supGroup.reverse());

    return result.reverse();
  }

  isEmptyGroup(group) {
    return String(this.deleteZerosLeft(group)) === '0';
  }

  getGroupText(group) {
    if (group.length === 1) {
      const text = this.getGroup(group[0]);
      return this.isEmptyGroup(group[0]) ? '' : text;
    }
    if (group.length === 2) {
      if (this.isEmptyGroup(group[0]) && this.isEmptyGroup(group[1])) return '';
      if (this.isEmptyGroup(group[0])) {
        const text = this.getGroup(group[1]);
        return this.isEmptyGroup(group[1]) ? '' : text;
      }
      const first = this.getGroup(group[0]);
      const second = this.getGroup(group[1]);
      return (first === this.units[1] ? '' : first + ' ') +
        this.especialCases.mil +
        (second === this.units[0] ? '' : ' ' + second);
    }
  }

  getScaleText(thousandsGrups) {
    
  }

  convert() {
    let toText = this.getScaleText(this.splitThousandsGrups(this.number));
    return toText;
  }
}

function addListeners() {
  document.getElementById('number-input').addEventListener('keyup', function() {
    const number = this.value;
    const result = new NumberConverter(number).convert();
    document.getElementById('number-text').innerText = result;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  addListeners();
});