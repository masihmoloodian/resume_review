import { message } from "antd";

export const openErrorNotification = (m: String) => {
  message.error(m);
  // notification.error({
  //   message: m,
  //   placement: "topRight",
  //   duration: 5,
  // });
};

export const openSuccessNotification = (m: String) => {
  message.success(m);
  // notification.success({
  //   message: m,
  //   placement: "topRight",
  //   duration: 5,
  // });
};
