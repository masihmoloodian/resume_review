import React from 'react';
import { Input } from 'antd';

interface InputFieldProps {
  placeholder: string;
  type?: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties; // Add style prop here
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, type = "text", value, name, onChange, style }) => {
  return <Input type={type} placeholder={placeholder} value={value} name={name} onChange={onChange} style={style} />;
};

export default InputField;
