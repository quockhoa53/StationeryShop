import { InputHTMLAttributes, memo } from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { FormLogin } from '~/types/auth'

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
  cssParents?: string
  cssInput?: string
  id: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  validate?: object
  iconRequire?: boolean
  label?: string | null
  register: UseFormRegister<any>
  error?: FieldErrors<FormLogin>
}

function InputForm({
  cssParents,
  cssInput,
  id,
  validate,
  iconRequire,
  label,
  iconLeft,
  iconRight,
  register,
  error,
  ...rest
}: InputFormProps) {
  return (
    <div className={cssParents + ' mt-1 relative'}>
      {label && (
        <label htmlFor={id}>
          {iconRequire && <span className='text-red-500'>*</span>}
          {label}
        </label>
      )}
      {iconLeft}
      <input
        type='text'
        id={id}
        {...register(id, validate)}
        className={`${
          error && error[id as keyof FormLogin] ? '!border-red-500' : ''
        } ${cssInput} placeholder:text-dark-light border-[1px] border-text-dark-gray rounded-md p-2 w-full outline-none focus:border-primary`}
        {...rest}
      />
      {iconRight}
      <div className='h-[19px] flex items-center '>
        {error && error[id as keyof FormLogin] ? (
          <small className='text-red-500 text-sm'>{error[id as keyof FormLogin]?.message}</small>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default memo(InputForm)
