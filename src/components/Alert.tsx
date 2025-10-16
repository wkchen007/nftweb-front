type AlertProps = {
  message: string,
  className?: string,
};

// React Function Component，型別為 React.FC<AlertProps>
const Alert: React.FC<AlertProps> = ({ message, className }) => {
  return (
    <div className={"alert " + (className ?? "")} role="alert">
      {message}
    </div>
  );
};

export default Alert;
