import axios from 'axios'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { createCookie } from 'react-router'
import CookieManager from '~/cookiemanager'
import { api } from '~/utils'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const { register, handleSubmit, setValue, formState } = useForm<LoginForm>()
  const onSubmit: SubmitHandler<LoginForm> = data =>
    axios
      .post(api('/login'), data)
      .then(e => {
        if (e.status !== 200) {
          throw 'Erreur ' + e.status
        }
        return e.data as { token: string }
      })
      .then(json => {
        console.log(json)
        CookieManager.setCookie('authorization', json.token)
      })
      .catch(e => alert(e))
  //   .then(() =>)

  return (
    <div>
      <form method="post" onSubmit={handleSubmit(onSubmit)} className="p-8">
        <label htmlFor="name">Email:</label>
        <input type="text" {...register('email')} />
        <br />

        <label htmlFor="password">Password:</label>
        <input type="text" {...register('password')} />
        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}
