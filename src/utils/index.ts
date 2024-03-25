import type { Serializer } from '@vueuse/core';
import { decode, encode } from 'js-base64';
export class Base64StringSerializer implements Serializer<string> {
  read(raw: string): string {
    return decode(raw);
  }

  write(value: string): string {
    return encode(value, false);
  }
}

export class Base64JsonSerializer implements Serializer<Record<string, any>> {
  read(raw: string): Record<string, any> {
    return JSON.parse(decode(raw));
  }

  write(value: Record<string, any>): string {
    return encode(JSON.stringify(value));
  }
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};

export const convertToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result?.toString() ?? '');
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export const numberWithComma = (value: string | number, digits = 2, isnull = 0) => {
  if (isNaN(Number(value)) || value === null) return isnull !== 0 ? isnull : isnull.toFixed(digits);
  else
    return Number(value)
      .toFixed(digits)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const completeLabel = (label: string, field: string) => {
  if (!!label && label !== '') return label;
  const fieldName = field;
  const newFieldName = fieldName.split(/(?=[A-Z])/).join(' ');
  return '' + String(newFieldName).charAt(0).toUpperCase() + String(newFieldName).replace(/_/g, ' ').slice(1) + '';
};

export const random = (length = 8) => {
  return Math.random().toString(16).substr(2, length);
};

export const transitionDate = (d: any, locale: string) => {
  const date = new Date(d).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const time = new Date(d).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  const result = `${date} ${locale === 'th-TH' ? 'เวลา' : 'at'} ${time} ` + (locale === 'th-TH' ? 'น.' : '');
  return result;
};

export function isEmpty(obj: object) {
  for (const prop in obj) {
    if (Object.assign(obj, prop)) {
      return false;
    }
  }
  return true;
}

export async function downloadFile(url: string, name: string) {
  const data = await fetch(`${window.location.origin}/${url}`);

  const blob = await data.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.target = '_blank';
  link.setAttribute('href', objectUrl);
  link.setAttribute('download', name);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function transferFileSize(size: number) {
  const SIZE_1KB = 1024;
  const SIZE_1MB = 1048576;
  if (size < 104858) {
    return size > 10 ? numberWithComma(size / SIZE_1KB) + ' KB' : '0.01 KB';
  } else {
    return numberWithComma(size / SIZE_1MB) + ' MB';
  }
}
