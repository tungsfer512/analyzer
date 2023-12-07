import moment from 'moment';
import _ from 'lodash';
import { chuanHoa } from '@/utils/utils';

const allCharacters =
  'a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹýếẾ';
// ten : trường tên
// text : trường text
// email
// soDienThoai
// ngaySinh
// required
// username
// password
// inputNumber
// CMND

const rules = {
  maTinh: [
    {
      len: 2,
      message: 'Mã tỉnh gồm 2 chữ số, ví dụ 01 hoặc 88',
    },
  ],
  maTruong: [
    {
      len: 3,
      message: 'Mã truoừng gồm 3 chữ số, ví dụ 001 hoặc 188',
    },
  ],
  dacbiet: [
    {
      pattern: new RegExp(`^[0-9${allCharacters} \n]+$`),
      message: 'Không chứa kí tự đặc biệt',
    },
  ],
  ten: [
    {
      max: 30,
      message: 'Không quá 50 kí tự',
    },
    {
      min: 6,
      message: 'Không ít hơn 6 kí tự',
    },
    {
      whitespace: true,
      message: 'Toàn kí tự trắng không hợp lệ',
    },
    {
      pattern: new RegExp(`^[${allCharacters} ]+$`),
      message: 'Tên chỉ bao gồm chữ cái',
    },
  ],
  text: [
    {
      whitespace: true,
      message: 'Toàn kí tự trắng không hợp lệ',
    },
  ],
  number: (max, min = 0) => [
    {
      pattern: new RegExp('^[0-9-]+$'),
      message: 'Chỉ được nhập số',
    },
    {
      validator: (__, value, callback) => {
        if (parseInt(value) > max) callback('');
        callback();
      },
      message: `Giá trị tối đa: ${max}`,
    },
    {
      validator: (__, value, callback) => {
        if (parseInt(value) < min) callback('');
        callback();
      },
      message: `Giá trị nhỏ nhất: ${min}`,
    },
  ],
  float: (max, min = 0, sauDauPhay = 2) => [
    {
      pattern: new RegExp('^[0-9.]+$'),
      message: 'Số hoặc dấu chấm',
    },
    {
      validator: (__, value, callback) => {
        if (max && parseFloat(value) > max) callback('');
        callback();
      },
      message: `Giá trị tối đa: ${max}`,
    },
    {
      validator: (__, value, callback) => {
        if (parseFloat(value) < min) callback('');
        callback();
      },
      message: `Giá trị nhỏ nhất: ${min}`,
    },
    {
      validator: (__, value, callback) => {
        const string = `${value}`.split('.');
        if (string.length === 2 && string[1].length > sauDauPhay) callback('');
        callback();
      },
      message: `Chỉ được ${sauDauPhay} số sau dấu phẩy`,
    },
  ],
  email: [
    {
      type: 'email',
      message: 'Email chưa đúng định dạng',
    },
  ],
  soDienThoai: [
    // {
    //   pattern: new RegExp('^[0-9]{10,11}$'),
    //   message: 'Số điện thoại không đúng định dạng(từ 10-11 số, không bao gồm kí tự đặc biệt)',
    // },
    {
      pattern: new RegExp(/((09|03|07|08|05|01|02|04|06)+([0-9]{8})\b)/g),
      message: 'Số điện thoại không đúng định dạng(10 số, không bao gồm kí tự đặc biệt)',
    },
  ],
  ngaySinh: [
    {
      validator: (_, value, callback) => {
        if (moment(value).isAfter(moment())) callback('');
        callback();
      },
      message: 'Ngày sinh chưa đúng',
    },
  ],
  dinhDangIP: [
    {
      validator: (_, value, callback) => {
        const arr = value?.split('.');
        if (!value) {
          callback();
          return;
        }
        if (arr.length !== 4) callback('');
        if (isNaN(arr[0])) callback('');
        if (isNaN(arr[1])) callback('');
        if (isNaN(arr[2])) callback('');
        if (isNaN(arr[3])) callback('');
        callback();
      },
      message: 'Định dạng IP chưa đúng. Định dạng đúng gồm 4 số',
    },
  ],
  truocNamNay: [
    {
      validator: (_, value, callback) => {
        if (value > moment().get('year')) callback('');
        callback();
      },
      message: 'Không được sau thời điểm hiện tại',
    },
  ],
  truocHomNay: [
    {
      validator: (_, value, callback) => {
        if (moment(value).isAfter(moment().add(1, 'minutes'), 'days')) callback('');
        callback();
      },
      message: 'Không được sau thời điểm hiện tại',
    },
  ],
  sauHomNay: [
    {
      validator: (_, value, callback) => {
        if (moment(value).isBefore(moment().subtract(1, 'minutes'), 'days')) callback('');
        callback();
      },
      message: 'Không được sớm hơn thời điểm hiện tại',
    },
  ],
  required: [
    {
      required: true,
      message: 'Bắt buộc',
    },
  ],
  username: [
    {
      pattern: new RegExp('^([a-zA-Z0-9._]{4,32}$)'),
      message: 'Độ dài 4 tới 32 kí tự, chỉ dùng chữ thường, chữ hoa, số, ".", "_"',
    },
    // {
    //   pattern: new RegExp('^(?![_.])[a-zA-Z0-9._]+(?<![_.])$'),
    //   message: 'Không bao gồm "_" hay "." ở đầu hoặc cuối'
    // }
  ],
  password: [
    {
      pattern: '^(?=.*[A-Za-z])(?=.*?[0-9]).{6,}$',
      message: 'Tối thiểu 6 ký tự, bao gồm các chữ cái, ít nhất một số',
    },
    // {
    //   pattern: new RegExp(
    //     '^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z~!@#$%^&*(_)+/<>?}{:;",.=|]+$'
    //   ),
    //   message: 'Bao gồm cả chữ và số'
    // }
  ],
  CMND: [
    {
      pattern: new RegExp('^[0-9]{9}$|^[0-9]{12}$'),
      message: 'Bao gồm 9 hoặc 12 chữ số',
    },
  ],
  length: len => [
    {
      max: len,
      message: `Không quá ${len} kí tự`,
    },
  ],
  textEditor: [
    {
      validator: (_, value, callback) => {
        const { text } = value;
        if (!text || !text.length || !text[0] || !chuanHoa(text).length) callback('');
        callback();
      },
      message: 'Hãy nhập nội dung',
    },
  ],
  fileRequired: [
    {
      validator: (__, value, callback) => {
        if (_.get(value, 'fileList', []).length == 0) callback('');
        callback();
      },
      message: 'Hãy chọn file',
    },
    {
      required: true,
      message: 'Bắt buộc',
    },
  ],
};

export const diemRules = {
  SAT: [...rules.required, ...rules.number(1600, 1130)],
  ACT: [...rules.required, ...rules.float(36, 25)],
  IELTS: [...rules.required, ...rules.float(9, 5.5)],
  TOEFLiBT: [...rules.required, ...rules.number(120, 65)],
  TOEFLITP: [...rules.required, ...rules.float(990, 513)],
};

export default rules;
