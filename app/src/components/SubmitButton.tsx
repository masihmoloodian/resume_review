import React from 'react';
import { Button } from 'antd';

interface SubmitButtonProps {
  onClick: () => void;
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, label }) => {
  return <Button type="primary" onClick={onClick}>{label}</Button>;
};

export default SubmitButton;
