import moment from 'moment';
import React from 'react';
// import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import _ from 'lodash';
import { v1 as uuidv1 } from 'uuid';

const map = {
  a: '[aàáâãăăạảấầẩẫậắằẳẵặ]',
  e: '[eèéẹẻẽêềềểễệế]',
  i: '[iìíĩỉị]',
  o: '[oòóọỏõôốồổỗộơớờởỡợ]',
  u: '[uùúũụủưứừửữự]',
  y: '[yỳỵỷỹý]',
  d: '[dđ]',
  ' ': ' ',
};

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo erat et lobortis aliquet. Sed id risus quis arcu tincidunt accumsan. Praesent venenatis tortor ut tempus elementum. Praesent venenatis diam fermentum massa imperdiet, eu pellentesque nisl scelerisque. Sed aliquet fermentum dui ac mattis. Proin sagittis dolor nulla, eget vulputate est malesuada ut. Quisque porta porta massa et semper. Sed ultricies varius risus et tempor. Ut volutpat varius nisl id posuere. Sed vel aliquet nisi, non blandit erat. Integer sagittis accumsan sapien at molestie. Sed consequat pharetra tortor, eu tincidunt erat lacinia in. Aenean efficitur mollis arcu, in bibendum ex imperdiet sit amet. Duis id massa dignissim, vehicula tortor sit amet, convallis odio. In ligula velit, rhoncus in justo nec, consectetur cursus purus.';

export function getLorem(length) {
  return lorem.substring(0, length);
}

export const ipServer = 'http://34.73.92.252:3030';

export function getNameFile(url) {
  if (typeof url !== 'string') return 'Đường dẫn không đúng';
  console.log(url, 'aaa');
  return url.split('/').slice(-1)[0].substring(29);
}

export function renderFileList(arr) {
  if (!arr) return { fileList: [] };
  return {
    fileList: arr.map((url) => ({
      uid: uuidv1(),
      name: getNameFile(url),
      url,
      status: 'done',
      size: 123,
      type: 'img/png',
    })),
  };
}

export function renderFileListUrl(url) {
  if (!url) return { fileList: [] };
  return {
    fileList: [
      {
        uid: uuidv1(),
        name: getNameFile(url),
        url,
        status: 'done',
        size: 123,
        type: 'img/png',
      },
    ],
  };
}

export function getRecordValue(model, cond, dataIndex, defaultValue) {
  const { edit, record } = model;
  if (edit) {
    return (
      _.get(record, `[${dataIndex}]._id`, undefined) ||
      _.get(record, `[${dataIndex}]`, undefined) ||
      defaultValue
    );
  }
  if (cond && cond[dataIndex]) return cond[dataIndex];

  return defaultValue;
}
export function Format(str) {
  // xóa hết dấu + đưa về chữ thường
  if (!str) return '';
  return str
    .toString()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd');
}

export function includes(str1, str2) {
  // str1 có chứa str2 ko
  return Format(str1).includes(Format(str2));
}

export function toHexa(str) {
  // render rgb color from a string
  if (!str) return '';
  const maxBase = 1000000007;
  const base = 16777216;
  let sum = 1;
  for (let i = 0; i < str.length; i += 1) {
    sum = (sum * str.charCodeAt(i)) % maxBase;
  }
  sum %= base;
  // return `#${sum.toString(16)}`;
  const colors = [
    'rgba(26, 94, 18, 0.7)',
    'rgba(84, 106, 47, 0.7)',
    'rgba(107, 143, 36, 0.7)',
    'rgba(45, 77, 0, 0.7)',
    'rgba(0, 100, 0, 0.7)',
    'rgba(47, 79, 79, 0.7)',
    'rgba(0, 128, 128, 0.7)',
    'rgba(0, 139, 139, 0.7)',
    'rgba(100, 149, 237, 0.7)',
  ];
  return colors[sum % colors.length];
}

function render(value) {
  // phục vụ hàm toRegex bên dưới
  let result = '';
  [...value].forEach(
    (char) =>
      (result += map[char] || ("$&+,:;=?@#|'<>.^*()%!-".includes(char) && `\\${char}`) || char),
  );
  return result;
}

// page: 1,
// limit: 10,
// cond: {
//   hoTen: toRegex('h')
// }

export function toRegex(value) {
  // convert từ string sang dạng regex.
  return { $regex: `${render(Format(value))}`, $options: 'i' };
}

export function tinhTuanHienTai(ngayHoc) {
  const batDauKy1 = '2019-09-05';
  // Tìm thứ của ngày bắt đầu kỳ 1
  const dateBatDauKy1 = moment(batDauKy1);
  const thuBatDauKy1 = dateBatDauKy1.day();

  const dateBatDauTuan1 = dateBatDauKy1.subtract(thuBatDauKy1 - 1, 'days');
  const dateNgayHoc = moment(ngayHoc);

  return dateNgayHoc.diff(dateBatDauTuan1, 'weeks') + 1;
}

export function tinhNgayTheoTuan(tuan, thu, ngayBatDau) {
  return moment(ngayBatDau)
    .add(tuan, 'weeks')
    .add(thu - 1, 'days');
}

export function Object2Regex(obj) {
  // convert từ string sang dạng regex.
  return Object.keys(obj).map((key) => ({
    [key]: { $regex: `.*${render(Format(obj[key]))}.*`, $options: 'i' },
  }));
}

export function isValue(val) {
  // check xem nếu bị undefined, null, xâu rỗng -> false
  if (!val && val !== 0) return false; // undefined, null
  if (val && val.length === 0) return false; // ""
  return true;
}

export function trim(string) {
  // nếu là moment thì cho sang string
  if (moment.isMoment(string)) return string?.toISOString() ?? '';
  // xóa tất cả dấu cách thừa
  if (typeof string !== 'string') return string;
  return string.replace(/[ ]{2,}/g, ' ').trim();
}
export function getDataById(data, _id, dataIndex) {
  // lấy dữ liệu từ biến data, trả lại dataIndex của phần tử trùng _id
  let res;
  data.map((item) => {
    console.log(item._id, _id, item._id === _id);
    if (item._id === _id) res = item[dataIndex];
  });
  return res || 'Dữ liệu không đúng';
}
export function currencyFormat(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
export function chuanHoa(ten) {
  return trim(ten)
    .split(' ')
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(' ');
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

// export function digitUppercase(n) {
//   return nzh.toMoney(n);
// }

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter((item) => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every((item) => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    (routePath) => routePath.indexOf(path) === 0 && routePath !== path,
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map((item) => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some((route) => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}


// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url, name) =>
  new Promise((resolve) => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });
