import React from 'react';
import { message } from 'antd';

message.config({
  duration: 2,
  top: 125,
  maxCount: 1,
});

export function showAlert(text, type) {
  if (type === 'error') {
    message.error(text, 3);
  } else {
    message.success(text);
  }
}