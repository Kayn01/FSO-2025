const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }
  if (type == "err") {
    return <div className="fail">{message}</div>;
  } else {
    return <div className="success">{message}</div>;
  }
};

export default Notification;
